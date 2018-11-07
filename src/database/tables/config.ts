const generateTableName = (tableName: string) => {
  const { NODE_ENV } = process.env;
  if ( NODE_ENV === "test" || !NODE_ENV ) return `${tableName}_mock`;
  return tableName;
}

export const LOG_ACCESS = {
  name: generateTableName("log_acesso"),
  fields: {
    id: { value: "id", type: "UUID", primaryKey: true },
    userId: { value: "usuario", type: "UUID" },
    createdAt: { value: "created_at", type: "DATE" },
    isLogoff: { value: "is_logoff", type: "BOOLEAN" }
  }
};

export const LOG_CALL = {
  name: generateTableName("log_chamada"),
  fields: {
    id: { value: "id", type: "UUID", primaryKey: true },
    userIdFrom: { value: "usuario_origem", type: "UUID" },
    createdAt: { value: "created_at", type: "DATE" },
    userIdTo: { value: "usuario_destino", type: "UUID" },
    type: { value: "tipo_chamada", type: "INT" },
    startedAt: { value: "data_inicio", type: "DATE" },
    endedAt: { value: "data_final", type: "DATE" },
    file: { value: "arquivo_gravacao", type: "VARCHAR", length: 255 },
    status: { value: "status", type: "INT" }
  }
};

export const LOG_CONFERENCE = {
  name: generateTableName("log_conferencia"),
  fields: {
    id: { value: "id", type: "UUID", primaryKey: true },
    createdAt: { value: "created_at", type: "DATE" },
    userIdFrom: { value: "usuario_origem", type: "UUID" },
    startedAt: { value: "data_inicio", type: "DATE" },
    endedAt: { value: "data_final", type: "DATE" },
    file: { value: "arquivo_gravacao", type: "VARCHAR", length: 255 },
    status: { value: "status", type: "INT" }
  }
};

export const LOG_CONFERENCE_PARTICIPANT = {
  name: generateTableName("log_conferencia_participante"),
  fields: {
    id: { value: "id", type: "UUID", primaryKey: true },
    createdAt: { value: "created_at", type: "DATE" },
    idConference: { value: "log_conferencia", type: "UUID" },
    userId: { value: "usuario", type: "UUID" },
    gotInAt: { value: "data_entrada", type: "DATE" },
    gotOutAt: { value: "data_saida", type: "DATE" },
    status: { value: "status", type: "INT" }
  }
};
