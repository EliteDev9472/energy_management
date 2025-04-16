
import { Connection } from "@/types/connection";
import { connectionService } from "@/services/connections/connectionService";

export class ConnectionService {
  async getConnections(): Promise<Connection[]> {
    return await connectionService.getConnections();
  }

  async getConnectionById(id: string): Promise<Connection | null> {
    return await connectionService.getConnectionById(id);
  }

  async createConnection(connection: Partial<Connection>): Promise<Connection | null> {
    return await connectionService.createConnection(connection);
  }

  async updateConnection(connection: Connection): Promise<Connection | null> {
    return await connectionService.updateConnection(connection);
  }

  async deleteConnection(id: string): Promise<boolean> {
    return await connectionService.deleteConnection(id);
  }
}

export default ConnectionService;
