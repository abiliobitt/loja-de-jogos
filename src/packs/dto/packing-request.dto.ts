import { ApiProperty } from '@nestjs/swagger';

export class DimensoesDto {
  @ApiProperty({ example: 20, description: 'Altura do produto em cm' })
  altura: number;

  @ApiProperty({ example: 15, description: 'Largura do produto em cm' })
  largura: number;

  @ApiProperty({ example: 30, description: 'Comprimento do produto em cm' })
  comprimento: number;
}

export class ProdutoDto {
  @ApiProperty({ example: 'PS5', description: 'Identificador ou nome do produto' })
  produto_id: string;

  @ApiProperty({ type: DimensoesDto })
  dimensoes: DimensoesDto;
}

export class PedidoDto {
  @ApiProperty({ example: 1, description: 'Identificador do pedido' })
  pedido_id: number;

  @ApiProperty({ type: [ProdutoDto] })
  produtos: ProdutoDto[];
}

export class PackingRequestDto {
  @ApiProperty({ type: [PedidoDto] })
  pedidos: PedidoDto[];
}
