import { ToastService } from './toast.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ToastService', () => {
  let service: ToastService;
  let snackBarMock: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    snackBarMock = {
      open: jest.fn(),
    } as any;

    service = new ToastService(snackBarMock);
  });

  it('should call snack.open with correct parameters for success', () => {
    service.success('Sucesso', 'Tudo certo');

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Sucesso\nTudo certo',
      'Fechar',
      expect.objectContaining({
        duration: 4000,
        panelClass: ['toast-success'],
        verticalPosition: 'top',
      })
    );
  });

  it('should call snack.open with correct parameters for error without description', () => {
    service.error('Erro fatal');

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Erro fatal',
      'Fechar',
      expect.objectContaining({
        panelClass: ['toast-error'],
      })
    );
  });

  it('should call snack.open with correct parameters for warn', () => {
    service.warn('Atenção', 'Campo obrigatório');

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Atenção\nCampo obrigatório',
      'Fechar',
      expect.objectContaining({
        panelClass: ['toast-warn'],
      })
    );
  });
});
