import { Test, TestingModule } from '@nestjs/testing';
import { PacksController } from './packs.controller';
import { PacksService } from './packs.service';

describe('PacksController', () => {
    let controller: PacksController;
    let service: PacksService;

    beforeEach(async () => {
        const mockPacksService = {
            packsPedidos: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PacksController],
            providers: [
                { provide: PacksService, useValue: mockPacksService },
            ],
        }).compile();

        controller = module.get<PacksController>(PacksController);
        service = module.get<PacksService>(PacksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call packsService.packsPedidos with pedidos from body', () => {
        const pedidos = [{ id: 1, quantidade: 2 }];
        const result = [{ id: 1, caixas: [] }];
        (service.packsPedidos as jest.Mock).mockReturnValue(result);

        const response = controller.packs({ pedidos });

        expect(service.packsPedidos).toHaveBeenCalledWith(pedidos);
        expect(response).toEqual({ pedidos: result });
    });

    it('should handle missing pedidos in body', () => {
        const result = [];
        (service.packsPedidos as jest.Mock).mockReturnValue(result);

        const response = controller.packs({});

        expect(service.packsPedidos).toHaveBeenCalledWith([]);
        expect(response).toEqual({ pedidos: result });
    });
});