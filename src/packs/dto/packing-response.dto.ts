export class CaixaResponse {
  caixa_id: string | null;
  produtos: string[];
  observacao?: string;
}

export class PedidoResponse {
  pedido_id: number;
  caixas: CaixaResponse[];
}

export class PackingResponseDto {
  pedidos: PedidoResponse[];
}
