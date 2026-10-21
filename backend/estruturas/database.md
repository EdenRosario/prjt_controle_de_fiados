
-- =========================================
-- 1. CLIENTES
-- =========================================
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE,
    cpf CHAR(11) NOT NULL UNIQUE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 2. USUARIOS
-- =========================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    email VARCHAR(100) UNIQUE,
    data_nascimento DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 3. PRODUTOS
-- =========================================
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco NUMERIC(10,2) NOT NULL
        CHECK (preco >= 0),
    estoque INTEGER DEFAULT 0
        CHECK (estoque >= 0),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    setor VARCHAR(50) NOT NULL DEFAULT 'Outros',
    estoque_minimo INTEGER DEFAULT 5
        CHECK (estoque_minimo >= 0),
    codigo_barras VARCHAR(50) UNIQUE,
    id_externo VARCHAR(100)
);


-- =========================================
-- 4. COMPRAS
-- =========================================
CREATE TABLE IF NOT EXISTS compras (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total NUMERIC(10,2) DEFAULT 0
        CHECK (total >= 0),
    status VARCHAR(20) DEFAULT 'aberto',

    CONSTRAINT fk_compras_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE RESTRICT
);


-- =========================================
-- 5. ITENS DA COMPRA
-- =========================================
CREATE TABLE IF NOT EXISTS itens_compra (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    compra_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL
        CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL
        CHECK (preco_unitario >= 0),

    CONSTRAINT fk_itens_compra_compra
        FOREIGN KEY (compra_id)
        REFERENCES compras(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_itens_compra_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE RESTRICT
);


-- =========================================
-- 6. PAGAMENTOS
-- =========================================
CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    compra_id INTEGER NOT NULL,
    valor_pago NUMERIC(10,2) NOT NULL
        CHECK (valor_pago > 0),
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pagamento VARCHAR(30),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_recebido NUMERIC(10,2),
    troco NUMERIC(10,2) NOT NULL DEFAULT 0
        CHECK (troco >= 0),

    CONSTRAINT fk_pagamentos_compra
        FOREIGN KEY (compra_id)
        REFERENCES compras(id)
        ON DELETE CASCADE
);
