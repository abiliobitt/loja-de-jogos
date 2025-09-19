import { PacksService } from './packs.service';

jest.mock('../common/boxes.constants', () => {
  const BOXES = [
    { id: 'small', dims: [30, 40, 80] },
    { id: 'medium', dims: [50, 50, 40] },
    { id: 'large', dims: [50, 80, 60] },
  ];
  const volumeOf = (dims: number[]) => dims[0] * dims[1] * dims[2];
  return { BOXES, volumeOf };
});

describe('PacksService', () => {
  let service: PacksService;

  beforeEach(() => {
    service = new PacksService();
  });

  it('should pack a single product that fits in a small box', () => {
    const pedidos = [
      {
        pedido_id: 'pedido1',
        produtos: [
          { produto_id: 'prod1', dimensoes: { altura: 5, largura: 5, comprimento: 5 } }
        ]
      }
    ];
    const result = service.packsPedidos(pedidos);
    expect(result).toEqual([
      {
        pedido_id: 'pedido1',
        caixas: [{ caixa_id: 'small', produtos: ['prod1'] }]
      }
    ]);
  });

  it('should pack multiple small products in the same box', () => {
    const pedidos = [
      {
        pedido_id: 'pedido2',
        produtos: [
          { produto_id: 'prod1', dimensoes: { altura: 5, largura: 5, comprimento: 5 } },
          { produto_id: 'prod2', dimensoes: { altura: 5, largura: 5, comprimento: 5 } }
        ]
      }
    ];
    const result = service.packsPedidos(pedidos);
    expect(result[0].caixas.length).toBe(1);
    expect(result[0].caixas[0].produtos).toEqual(['prod1', 'prod2']);
    expect(result[0].caixas[0].caixa_id).toBe('small');
  });

  it('should use multiple boxes if products together exceed box volume', () => {
    const pedidos = [
      {
        pedido_id: 'pedido3',
        produtos: [
          { produto_id: 'prod1', dimensoes: { altura: 30, largura: 40, comprimento: 40 } },
          { produto_id: 'prod2', dimensoes: { altura: 30, largura: 40, comprimento: 50 } }
        ]
      }
    ];
    const result = service.packsPedidos(pedidos);
    expect(result[0].caixas.length).toBe(2);
    expect(result[0].caixas[0].produtos).toEqual(['prod2']);
    expect(result[0].caixas[1].produtos).toEqual(['prod1']);
  });

  it('should pick the smallest box that fits a product', () => {
    const pedidos = [
      {
        pedido_id: 'pedido4',
        produtos: [
          { produto_id: 'prod1', dimensoes: { altura: 15, largura: 15, comprimento: 15 } }
        ]
      }
    ];
    const result = service.packsPedidos(pedidos);
    expect(result[0].caixas[0].caixa_id).toBe('small');
  });

  it('should handle product that does not fit in any box', () => {
    const pedidos = [
      {
        pedido_id: 'pedido5',
        produtos: [
          { produto_id: 'prod1', dimensoes: { altura: 100, largura: 100, comprimento: 100 } }
        ]
      }
    ];
    const result = service.packsPedidos(pedidos);
    expect(result[0].caixas[0].caixa_id).toBeNull();
    expect(result[0].caixas[0].produtos).toEqual(['prod1']);
    expect(result[0].caixas[0].observacao).toBe('Produto não cabe em nenhuma caixa disponível.');
  });

  it('should handle empty pedidos array', () => {
    const pedidos: any[] = [];
    const result = service.packsPedidos(pedidos);
    expect(result).toEqual([]);
  });

  it('should handle pedido with no products', () => {
    const pedidos = [
      { pedido_id: 'pedido6', produtos: [] }
    ];
    const result = service.packsPedidos(pedidos);
    expect(result[0].caixas).toEqual([]);
  });

  it('should consider product rotation for fitting', () => {
    const pedidos = [
      {
        pedido_id: 'pedido7',
        produtos: [
          { produto_id: 'prod1', dimensoes: { altura: 10, largura: 30, comprimento: 5 } }
        ]
      }
    ];
    const result = service.packsPedidos(pedidos);
    expect(result[0].caixas[0].caixa_id).toBe('small');
  });

  it('should pack mixed size products deterministically', () => {
    const pedidos = [
      {
        pedido_id: 'pedido8',
        produtos: [
          { produto_id: 'small1', dimensoes: { altura: 30, largura: 35, comprimento: 80 } },
          { produto_id: 'medium1', dimensoes: { altura: 50, largura: 50, comprimento: 40 } },
          { produto_id: 'large1', dimensoes: { altura: 50, largura: 80, comprimento: 60 } }

        ]
      }
    ];

    const result = service.packsPedidos(pedidos);

    expect(result[0].caixas.length).toBe(3);

    const caixasMap = result[0].caixas.reduce((acc, c) => {
      c.produtos.forEach(p => (acc[p] = c.caixa_id));
      return acc;
    }, {} as Record<string, string | null>);

    expect(caixasMap['large1']).toBe('large');
    expect(caixasMap['medium1']).toBe('medium');
    expect(caixasMap['small1']).toBe('small');
  });


});
