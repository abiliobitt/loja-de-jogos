import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PacksService } from './packs.service';
import { PackingRequestDto } from './dto/packing-request.dto';

@ApiTags('packing')
@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) { }

  @Post()
  @ApiOperation({ summary: 'Recebe pedidos e retorna caixas e produtos alocados' })
  @ApiResponse({ status: 200, description: 'Resultado do empacotamento' })
  @ApiBody({ type: PackingRequestDto })
  packs(@Body() body: any) {
    const pedidos = body.pedidos || [];
    const results = this.packsService.packsPedidos(pedidos);
    return { pedidos: results };
  }
}
