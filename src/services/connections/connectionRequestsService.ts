
import { supabase } from '@/integrations/supabase/client';
import { ConnectionRequest, EmailLog } from '@/types/project';
import { toast } from '@/hooks/use-toast';

export class ConnectionRequestsService {
  /**
   * Get all connection requests for a specific object
   */
  static async getConnectionRequestsByObjectId(objectId: string): Promise<ConnectionRequest[]> {
    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('object_id', objectId)
        .order('request_date', { ascending: false });

      if (error) {
        console.error('Error fetching connection requests:', error);
        throw error;
      }

      return data.map(this.mapFromDatabase);
    } catch (error) {
      console.error('Error in getConnectionRequestsByObjectId:', error);
      return [];
    }
  }

  /**
   * Create a new connection request
   */
  static async createConnectionRequest(request: ConnectionRequest): Promise<ConnectionRequest> {
    try {
      // First, create the main connection request record
      const { data, error } = await supabase
        .from('connection_requests')
        .insert({
          object_id: request.objectId,
          object_name: request.objectName,
          address: request.address,
          city: request.city,
          postal_code: request.postalCode,
          type: request.type,
          capacity: request.capacity,
          grid_operator: request.gridOperator,
          status: request.status,
          request_date: request.requestDate,
          desired_connection_date: request.desiredConnectionDate,
          ean: request.ean || '',
          installer: request.installer,
          installer_email: request.installerEmail,
          installer_phone: request.installerPhone
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating connection request:', error);
        throw error;
      }

      // If email logs are provided, add them to the database
      if (request.emailLogs && request.emailLogs.length > 0) {
        for (const log of request.emailLogs) {
          await this.createEmailLog(data.id, log);
        }
      }

      // Return the created connection request with mapped fields
      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Error in createConnectionRequest:', error);
      throw error;
    }
  }

  /**
   * Update an existing connection request
   */
  static async updateConnectionRequest(id: string, updates: Partial<ConnectionRequest>): Promise<ConnectionRequest> {
    try {
      // Map the updates to database field names
      const dbUpdates: Record<string, any> = {};
      
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.gridOperatorWorkNumber) dbUpdates.grid_operator_work_number = updates.gridOperatorWorkNumber;
      if (updates.plannedConnectionDate) dbUpdates.planned_connection_date = updates.plannedConnectionDate;
      if (updates.connectionDate) dbUpdates.connection_date = updates.connectionDate;
      if (updates.ean) dbUpdates.ean = updates.ean;
      if (updates.installer) dbUpdates.installer = updates.installer;
      if (updates.installerEmail) dbUpdates.installer_email = updates.installerEmail;
      if (updates.installerPhone) dbUpdates.installer_phone = updates.installerPhone;

      const { data, error } = await supabase
        .from('connection_requests')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating connection request:', error);
        throw error;
      }

      // If email logs are provided in the updates, add them to the database
      if (updates.emailLogs && updates.emailLogs.length > 0) {
        for (const log of updates.emailLogs) {
          await this.createEmailLog(id, log);
        }
      }

      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Error in updateConnectionRequest:', error);
      throw error;
    }
  }

  /**
   * Add an email log to a connection request
   */
  static async createEmailLog(connectionRequestId: string, log: EmailLog): Promise<void> {
    try {
      const { error } = await supabase
        .from('connection_request_email_logs')
        .insert({
          connection_request_id: connectionRequestId,
          date: log.date,
          recipient: log.recipient,
          subject: log.subject,
          type: log.type,
          content: log.content
        });

      if (error) {
        console.error('Error creating email log:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in createEmailLog:', error);
    }
  }

  /**
   * Get all email logs for a connection request
   */
  static async getEmailLogs(connectionRequestId: string): Promise<EmailLog[]> {
    try {
      const { data, error } = await supabase
        .from('connection_request_email_logs')
        .select('*')
        .eq('connection_request_id', connectionRequestId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching email logs:', error);
        throw error;
      }

      return data.map(this.mapEmailLogFromDatabase);
    } catch (error) {
      console.error('Error in getEmailLogs:', error);
      return [];
    }
  }

  /**
   * Send an email to the grid operator
   */
  static async sendGridOperatorEmail(emailLog: EmailLog, connectionRequestId: string): Promise<boolean> {
    try {
      // Call the send-email edge function
      const { data, error } = await supabase.functions.invoke('send-grid-operator-email', {
        body: {
          connectionRequestId,
          emailLog
        }
      });

      if (error) {
        console.error('Error sending grid operator email:', error);
        toast({
          title: "Fout bij versturen e-mail",
          description: "De e-mail kon niet worden verzonden naar de netbeheerder.",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in sendGridOperatorEmail:', error);
      return false;
    }
  }

  /**
   * Map a database record to a ConnectionRequest object
   */
  private static mapFromDatabase(record: any): ConnectionRequest {
    return {
      id: record.id,
      objectId: record.object_id,
      objectName: record.object_name,
      address: record.address,
      city: record.city,
      postalCode: record.postal_code,
      type: record.type,
      capacity: record.capacity,
      gridOperator: record.grid_operator,
      status: record.status,
      requestDate: record.request_date,
      desiredConnectionDate: record.desired_connection_date,
      ean: record.ean,
      plannedConnectionDate: record.planned_connection_date,
      gridOperatorWorkNumber: record.grid_operator_work_number,
      connectionDate: record.connection_date,
      installer: record.installer,
      installerEmail: record.installer_email,
      installerPhone: record.installer_phone
    };
  }

  /**
   * Map a database record to an EmailLog object
   */
  private static mapEmailLogFromDatabase(record: any): EmailLog {
    return {
      date: record.date,
      recipient: record.recipient,
      subject: record.subject,
      type: record.type as any,
      content: record.content
    };
  }
}

