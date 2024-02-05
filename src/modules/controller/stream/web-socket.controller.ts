import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PaymentStatus } from 'src/modules/domain/payment.entity';
import { PaymentService } from 'src/modules/service/payment.service';

@WebSocketGateway()
export class WebSocketController implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private paymentService: PaymentService) {}

  afterInit(server: Server) {
    this.server = server;
    this.paymentService.setServer(server);
  }

  async handleConnection(client: Socket) {
    // При подключении клиента отправить все платежи со статусом 'created'
    const createdPayments = await this.paymentService.getPaymentsByFields({
      status: PaymentStatus.Created,
    });
    client.emit('initialPayments', createdPayments);
  }

  handleDisconnect(client: Socket) {
    // Логика при отключении клиента
  }
}
