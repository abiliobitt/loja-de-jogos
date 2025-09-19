import { Injectable } from '@nestjs/common';
import { BOXES, volumeOf } from '../common/boxes.constants';

type Product = { id: string; dims: number[]; volume: number };
type OpenBox = { typeId: string | null; dims: number[]; usedVolume: number; products: Product[]; capacity: number };

function permuteDims(dims: number[]) {
  const [a, b, c] = dims;
  return [
    [a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]
  ];
}

@Injectable()
export class PacksService {
  packsPedidos(pedidos: any[]) {
    return pedidos.map(p => this.packsSinglePedido(p));
  }

  private packsSinglePedido(pedido: any) {
    const products: Product[] = (pedido.produtos || []).map(p => {
      const dims = [p.dimensoes.altura, p.dimensoes.largura, p.dimensoes.comprimento];
      return { id: p.produto_id, dims, volume: dims[0] * dims[1] * dims[2] };
    });

    products.sort((a, b) => {
      if (b.volume !== a.volume) return b.volume - a.volume;
      const sumA = a.dims.reduce((x, y) => x + y, 0);
      const sumB = b.dims.reduce((x, y) => x + y, 0);
      return sumB - sumA;
    });

    const openBoxes: OpenBox[] = [];

    for (const prod of products) {
      let placed = false;
      for (const box of openBoxes) {
        if (this.productFitsInBox(prod, box)) {
          box.products.push(prod);
          box.usedVolume += prod.volume;
          placed = true;
          break;
        }
      }

      if (!placed) {
        const chosen = BOXES
          .map(b => ({ ...b, capacity: volumeOf(b.dims) }))
          .filter(b => this.productFitsDims(prod, b.dims))
          .sort((x, y) => x.capacity - y.capacity)[0];

        openBoxes.push({
          typeId: chosen ? chosen.id : null,
          dims: chosen ? chosen.dims.slice() : prod.dims.slice(),
          usedVolume: prod.volume,
          products: [prod],
          capacity: chosen ? chosen.capacity : prod.volume
        });
      }
    }

    const caixas = openBoxes.map(b => ({
      caixa_id: b.typeId,
      produtos: b.products.map(p => p.id),
      ...(b.typeId === null ? { observacao: "Produto não cabe em nenhuma caixa disponível." } : {})
    }));

    return {
      pedido_id: pedido.pedido_id,
      caixas
    };
  }


  private productFitsInBox(prod: Product, box: OpenBox) {
    if (box.usedVolume + prod.volume > box.capacity) return false;
    return this.productFitsDims(prod, box.dims);
  }

  private productFitsDims(prod: Product, boxDims: number[]) {
    const perms = permuteDims(prod.dims);
    return perms.some(p => p[0] <= boxDims[0] && p[1] <= boxDims[1] && p[2] <= boxDims[2]);
  }
}
