
import { getConnections } from './getConnections';
import { getConnectionById } from './getConnectionById';
import { updateConnection } from './updateConnection';
import { createConnection } from './createConnection';
import { deleteConnection } from './deleteConnection';
import { hierarchicalConnectionService } from './hierarchicalConnectionService';

export const connectionService = {
  getConnections,
  getConnectionById,
  updateConnection,
  createConnection,
  deleteConnection,
  
  // Include hierarchical connection service methods
  getConnectionRequestsByObjectId: hierarchicalConnectionService.getConnectionRequestsByObjectId,
  getConnectionRequestsByProjectId: hierarchicalConnectionService.getConnectionRequestsByProjectId,
  createConnectionRequest: hierarchicalConnectionService.createConnectionRequest,
  updateConnectionRequest: hierarchicalConnectionService.updateConnectionRequest,
  deleteConnectionRequest: hierarchicalConnectionService.deleteConnectionRequest
};

export default connectionService;
