export const LOG_ACCESS = {
  name: "log_acesso",
  fields: {
    id: { value: "id", type: "UUID" },
    userId: { value: "usuario", type: "UUID" },
    createdAt: { value: "data", type: "DATE" },
    isLogoff: { value: "is_logoff", type: "BOOLEAN" }
  }
};

export const LOG_CALL = {
  name: "log_chamada",
  fields: {
    id: { value: "id", type: "UUID" },
    userIdFrom: { value: "usuario_origem", type: "UUID" },
    userIdTo: { value: "usuario_destino", type: "UUID" },
    type: { value: "tipo_chamada", type: "INT" },
    startedAt: { value: "data_inicio", type: "DATE" },
    endedAt: { value: "data_final", type: "DATE" },
    file: { value: "arquivo_gravacao", type: "VARCHAR", length: 255 },
    status: { value: "status", type: "INT" }
  }
};

export const LOG_CONFERENCE = {
  name: "log_conferencia",
  fields: {
    id: { value: "id", type: "UUID" },
    userIdFrom: { value: "usuario_origem", type: "UUID" },
    startedAt: { value: "data_inicio", type: "DATE" },
    endedAt: { value: "data_final", type: "DATE" },
    file: { value: "arquivo_gravacao", type: "VARCHAR", length: 255 },
    status: { value: "status", type: "INT" }
  }
};

export const LOG_CONFERENCE_PARTICIPANT = {
  name: "log_conferencia_participante",
  fields: {
    id: { value: "id", type: "UUID" },
    idConference: { value: "log_conferencia", type: "UUID" },
    userId: { value: "usuario", type: "UUID" },
    gotInAt: { value: "data_entrada", type: "DATE" },
    gotOutAt: { value: "data_saida", type: "DATE" },
    status: { value: "status", type: "INT" }
  }
};
