export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billing_items: {
        Row: {
          amount: number
          billable_from: string
          created_at: string
          id: string
          invoice_id: string | null
          last_billed_month: string | null
          organization_id: string
          reference_id: string
          reference_name: string
          reference_type: string
          status: string
          type: string
        }
        Insert: {
          amount: number
          billable_from: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          last_billed_month?: string | null
          organization_id: string
          reference_id: string
          reference_name: string
          reference_type: string
          status?: string
          type: string
        }
        Update: {
          amount?: number
          billable_from?: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          last_billed_month?: string | null
          organization_id?: string
          reference_id?: string
          reference_name?: string
          reference_type?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "organization_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          entity_id: string | null
          entityid: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entityid?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entityid?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_entity_id_fkey"
            columns: ["entityid"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_entity_id_fkey1"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      complexes: {
        Row: {
          address: string
          city: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          postal_code: string | null
          postalcode: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          postal_code?: string | null
          postalcode: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          postal_code?: string | null
          postalcode?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complexes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_billing_history: {
        Row: {
          amount: number
          billing_date: string
          billing_period_end: string
          billing_period_start: string
          connection_id: string
          created_at: string
          id: string
          invoice_number: string | null
          status: string
        }
        Insert: {
          amount: number
          billing_date?: string
          billing_period_end: string
          billing_period_start: string
          connection_id: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          status?: string
        }
        Update: {
          amount?: number
          billing_date?: string
          billing_period_end?: string
          billing_period_start?: string
          connection_id?: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_billing_history_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "energy_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_contract_details: {
        Row: {
          conditions: string | null
          connection_id: string | null
          created_at: string
          end_date: string | null
          id: string
          price: string | null
          start_date: string | null
          type: string | null
        }
        Insert: {
          conditions?: string | null
          connection_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          price?: string | null
          start_date?: string | null
          type?: string | null
        }
        Update: {
          conditions?: string | null
          connection_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          price?: string | null
          start_date?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connection_contract_details_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_documents: {
        Row: {
          connection_id: string | null
          created_at: string
          file_path: string | null
          id: string
          name: string
          upload_date: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string
          file_path?: string | null
          id?: string
          name: string
          upload_date: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string
          file_path?: string | null
          id?: string
          name?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_documents_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_feedback: {
        Row: {
          connection_id: string
          created_at: string
          created_by: string | null
          created_by_name: string | null
          id: string
          text: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          id?: string
          text: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_feedback_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "energy_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_history: {
        Row: {
          connection_id: string | null
          created_at: string
          date: string
          description: string | null
          event: string
          id: string
          status: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          event: string
          id?: string
          status: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          event?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_history_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_request_email_logs: {
        Row: {
          connection_request_id: string
          content: string | null
          created_at: string
          date: string
          id: string
          recipient: string
          subject: string
          type: string
        }
        Insert: {
          connection_request_id: string
          content?: string | null
          created_at?: string
          date: string
          id?: string
          recipient: string
          subject: string
          type: string
        }
        Update: {
          connection_request_id?: string
          content?: string | null
          created_at?: string
          date?: string
          id?: string
          recipient?: string
          subject?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_request_email_logs_connection_request_id_fkey"
            columns: ["connection_request_id"]
            isOneToOne: false
            referencedRelation: "connection_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_requests: {
        Row: {
          address: string
          capacity: string
          city: string
          connection_date: string | null
          created_at: string
          desired_connection_date: string
          ean: string | null
          grid_operator: string
          grid_operator_work_number: string | null
          id: string
          in_progress_date: string | null
          installer: string | null
          installer_email: string | null
          installer_phone: string | null
          object_id: string
          object_name: string
          planned_connection_date: string | null
          postal_code: string
          request_date: string
          status: string
          type: string
        }
        Insert: {
          address: string
          capacity: string
          city: string
          connection_date?: string | null
          created_at?: string
          desired_connection_date: string
          ean?: string | null
          grid_operator: string
          grid_operator_work_number?: string | null
          id?: string
          in_progress_date?: string | null
          installer?: string | null
          installer_email?: string | null
          installer_phone?: string | null
          object_id: string
          object_name: string
          planned_connection_date?: string | null
          postal_code: string
          request_date?: string
          status: string
          type: string
        }
        Update: {
          address?: string
          capacity?: string
          city?: string
          connection_date?: string | null
          created_at?: string
          desired_connection_date?: string
          ean?: string | null
          grid_operator?: string
          grid_operator_work_number?: string | null
          id?: string
          in_progress_date?: string | null
          installer?: string | null
          installer_email?: string | null
          installer_phone?: string | null
          object_id?: string
          object_name?: string
          planned_connection_date?: string | null
          postal_code?: string
          request_date?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      connection_statuses: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      connection_technical_details: {
        Row: {
          connection_fee: string | null
          connection_id: string | null
          created_at: string
          id: string
          max_capacity: string | null
          metering_type: string | null
          phases: string | null
          voltage: string | null
        }
        Insert: {
          connection_fee?: string | null
          connection_id?: string | null
          created_at?: string
          id?: string
          max_capacity?: string | null
          metering_type?: string | null
          phases?: string | null
          voltage?: string | null
        }
        Update: {
          connection_fee?: string | null
          connection_id?: string | null
          created_at?: string
          id?: string
          max_capacity?: string | null
          metering_type?: string | null
          phases?: string | null
          voltage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connection_technical_details_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_types: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      connection_usage: {
        Row: {
          connection_id: string | null
          created_at: string
          date: string
          id: string
          unit: string
          value: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string
          date: string
          id?: string
          unit: string
          value: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string
          date?: string
          id?: string
          unit?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_usage_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          address: string
          capacity: string | null
          city: string | null
          complex: string | null
          complex_id: string | null
          connection_address: string | null
          created_at: string
          created_by: string | null
          desired_connection_date: string | null
          ean: string | null
          entity: string | null
          grid_operator: string | null
          grid_operator_contact: string | null
          grid_operator_work_number: string | null
          history: Json | null
          id: string
          last_modified: string | null
          metering_company: string | null
          object: string | null
          object_id: string | null
          organization: string | null
          planned_connection_date: string | null
          postal_code: string | null
          project_id: string | null
          request_date: string
          status: string
          supplier: string | null
          type: string
          updated_at: string
        }
        Insert: {
          address: string
          capacity?: string | null
          city?: string | null
          complex?: string | null
          complex_id?: string | null
          connection_address?: string | null
          created_at?: string
          created_by?: string | null
          desired_connection_date?: string | null
          ean?: string | null
          entity?: string | null
          grid_operator?: string | null
          grid_operator_contact?: string | null
          grid_operator_work_number?: string | null
          history?: Json | null
          id?: string
          last_modified?: string | null
          metering_company?: string | null
          object?: string | null
          object_id?: string | null
          organization?: string | null
          planned_connection_date?: string | null
          postal_code?: string | null
          project_id?: string | null
          request_date?: string
          status: string
          supplier?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          address?: string
          capacity?: string | null
          city?: string | null
          complex?: string | null
          complex_id?: string | null
          connection_address?: string | null
          created_at?: string
          created_by?: string | null
          desired_connection_date?: string | null
          ean?: string | null
          entity?: string | null
          grid_operator?: string | null
          grid_operator_contact?: string | null
          grid_operator_work_number?: string | null
          history?: Json | null
          id?: string
          last_modified?: string | null
          metering_company?: string | null
          object?: string | null
          object_id?: string | null
          organization?: string | null
          planned_connection_date?: string | null
          postal_code?: string | null
          project_id?: string | null
          request_date?: string
          status?: string
          supplier?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_complex_fkey"
            columns: ["complex"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_connections: {
        Row: {
          activation_date: string | null
          address: string
          capacity: string | null
          city: string
          complex_id: string | null
          created_at: string
          created_by: string | null
          desired_connection_date: string | null
          ean: string | null
          grid_operator: string | null
          grid_operator_work_number: string | null
          id: string
          in_progress_date: string | null
          installer: string | null
          is_active_subscription: boolean | null
          last_modified: string
          meter_role: string | null
          object_id: string | null
          object_name: string | null
          organization_id: string | null
          planned_connection_date: string | null
          postal_code: string
          project_id: string | null
          request_date: string
          status: string
          type: string
        }
        Insert: {
          activation_date?: string | null
          address: string
          capacity?: string | null
          city: string
          complex_id?: string | null
          created_at?: string
          created_by?: string | null
          desired_connection_date?: string | null
          ean?: string | null
          grid_operator?: string | null
          grid_operator_work_number?: string | null
          id?: string
          in_progress_date?: string | null
          installer?: string | null
          is_active_subscription?: boolean | null
          last_modified?: string
          meter_role?: string | null
          object_id?: string | null
          object_name?: string | null
          organization_id?: string | null
          planned_connection_date?: string | null
          postal_code: string
          project_id?: string | null
          request_date?: string
          status: string
          type: string
        }
        Update: {
          activation_date?: string | null
          address?: string
          capacity?: string | null
          city?: string
          complex_id?: string | null
          created_at?: string
          created_by?: string | null
          desired_connection_date?: string | null
          ean?: string | null
          grid_operator?: string | null
          grid_operator_work_number?: string | null
          id?: string
          in_progress_date?: string | null
          installer?: string | null
          is_active_subscription?: boolean | null
          last_modified?: string
          meter_role?: string | null
          object_id?: string | null
          object_name?: string | null
          organization_id?: string | null
          planned_connection_date?: string | null
          postal_code?: string
          project_id?: string | null
          request_date?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "energy_connections_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "energy_connections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          organizationid: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          organizationid?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          organizationid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entities_organization_id_fkey"
            columns: ["organizationid"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entities_organization_id_fkey1"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_documents: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          created_by: string
          due_date: string | null
          id: string
          issue_date: string
          items: Json | null
          notes: string | null
          number: string
          project_id: string | null
          related_quote_id: string | null
          status: string
          subtotal: number | null
          type: string
          updated_at: string
          url: string | null
          vat_amount: number | null
          vat_rate: number | null
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          created_by: string
          due_date?: string | null
          id?: string
          issue_date: string
          items?: Json | null
          notes?: string | null
          number: string
          project_id?: string | null
          related_quote_id?: string | null
          status: string
          subtotal?: number | null
          type: string
          updated_at?: string
          url?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          issue_date?: string
          items?: Json | null
          notes?: string | null
          number?: string
          project_id?: string | null
          related_quote_id?: string | null
          status?: string
          subtotal?: number | null
          type?: string
          updated_at?: string
          url?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_documents_related_quote_id_fkey"
            columns: ["related_quote_id"]
            isOneToOne: false
            referencedRelation: "financial_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      meters: {
        Row: {
          created_at: string | null
          ean: string | null
          id: string
          name: string
          object_id: string | null
          role: string
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          ean?: string | null
          id?: string
          name: string
          object_id?: string | null
          role: string
          status: string
          type: string
        }
        Update: {
          created_at?: string | null
          ean?: string | null
          id?: string
          name?: string
          object_id?: string | null
          role?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "meters_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
        ]
      }
      objects: {
        Row: {
          address: string
          build_phase: string | null
          buildphase: string | null
          city: string
          complex_id: string | null
          complex_name: string | null
          complexid: string | null
          created_at: string | null
          id: string
          name: string
          object_type: string | null
          objecttype: string | null
          postal_code: string | null
          postalcode: string
          project_id: string | null
        }
        Insert: {
          address: string
          build_phase?: string | null
          buildphase?: string | null
          city: string
          complex_id?: string | null
          complex_name?: string | null
          complexid?: string | null
          created_at?: string | null
          id?: string
          name: string
          object_type?: string | null
          objecttype?: string | null
          postal_code?: string | null
          postalcode: string
          project_id?: string | null
        }
        Update: {
          address?: string
          build_phase?: string | null
          buildphase?: string | null
          city?: string
          complex_id?: string | null
          complex_name?: string | null
          complexid?: string | null
          created_at?: string | null
          id?: string
          name?: string
          object_type?: string | null
          objecttype?: string | null
          postal_code?: string | null
          postalcode?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_complex_id_fkey"
            columns: ["complexid"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_complex_id_fkey1"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_financial_details: {
        Row: {
          bank_name: string | null
          bic: string | null
          city: string
          created_at: string
          iban: string | null
          id: string
          invoice_address: string
          invoice_name: string
          monthly_ean_rate: number | null
          organization_id: string
          postal_code: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          bank_name?: string | null
          bic?: string | null
          city: string
          created_at?: string
          iban?: string | null
          id?: string
          invoice_address: string
          invoice_name: string
          monthly_ean_rate?: number | null
          organization_id: string
          postal_code?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          bank_name?: string | null
          bic?: string | null
          city?: string
          created_at?: string
          iban?: string | null
          id?: string
          invoice_address?: string
          invoice_name?: string
          monthly_ean_rate?: number | null
          organization_id?: string
          postal_code?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_financial_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invoices: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          file_path: string | null
          id: string
          invoice_number: string
          issue_date: string
          organization_id: string
          payment_type: string
          reference_id: string | null
          reference_type: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          file_path?: string | null
          id?: string
          invoice_number: string
          issue_date: string
          organization_id: string
          payment_type: string
          reference_id?: string | null
          reference_type?: string | null
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          file_path?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          organization_id?: string
          payment_type?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          assigned_consultant_id: string | null
          bic: string | null
          city: string | null
          created_at: string | null
          description: string | null
          has_mandate: boolean | null
          iban: string | null
          id: string
          invoice_address: string | null
          invoice_city: string | null
          invoice_name: string | null
          invoice_postal_code: string | null
          kvk_number: string | null
          mandate_file_path: string | null
          name: string
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          pending_deletion: boolean | null
          scheduled_deletion_time: string | null
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          assigned_consultant_id?: string | null
          bic?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          has_mandate?: boolean | null
          iban?: string | null
          id?: string
          invoice_address?: string | null
          invoice_city?: string | null
          invoice_name?: string | null
          invoice_postal_code?: string | null
          kvk_number?: string | null
          mandate_file_path?: string | null
          name: string
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          pending_deletion?: boolean | null
          scheduled_deletion_time?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          assigned_consultant_id?: string | null
          bic?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          has_mandate?: boolean | null
          iban?: string | null
          id?: string
          invoice_address?: string | null
          invoice_city?: string | null
          invoice_name?: string | null
          invoice_postal_code?: string | null
          kvk_number?: string | null
          mandate_file_path?: string | null
          name?: string
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          pending_deletion?: boolean | null
          scheduled_deletion_time?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      project_comments: {
        Row: {
          created_at: string
          created_by: string
          id: string
          project_id: string
          text: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          project_id: string
          text: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          project_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_details: {
        Row: {
          comment_ids: string[] | null
          created_at: string
          document_ids: string[] | null
          id: string
          project_id: string | null
          project_number: string
          task_ids: string[] | null
          team_ids: string[] | null
          updated_at: string
        }
        Insert: {
          comment_ids?: string[] | null
          created_at?: string
          document_ids?: string[] | null
          id?: string
          project_id?: string | null
          project_number: string
          task_ids?: string[] | null
          team_ids?: string[] | null
          updated_at?: string
        }
        Update: {
          comment_ids?: string[] | null
          created_at?: string
          document_ids?: string[] | null
          id?: string
          project_id?: string | null
          project_number?: string
          task_ids?: string[] | null
          team_ids?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_details_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          id: string
          name: string
          project_id: string
          type: string
          uploaded_at: string
          uploaded_by: string
          url: string
        }
        Insert: {
          id?: string
          name: string
          project_id: string
          type: string
          uploaded_at?: string
          uploaded_by: string
          url: string
        }
        Update: {
          id?: string
          name?: string
          project_id?: string
          type?: string
          uploaded_at?: string
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team: {
        Row: {
          added_at: string
          added_by: string
          id: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          id?: string
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          added_at?: string
          added_by?: string
          id?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_team_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string
          building_phase: string
          category_id: string | null
          city: string
          connection_count: number | null
          created_at: string
          created_by: string
          customer: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          notes: string | null
          project_manager: string | null
          project_number: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          building_phase: string
          category_id?: string | null
          city: string
          connection_count?: number | null
          created_at?: string
          created_by: string
          customer: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          project_manager?: string | null
          project_number?: string | null
          start_date: string
          status: string
          updated_at?: string
        }
        Update: {
          address?: string
          building_phase?: string
          category_id?: string | null
          city?: string
          connection_count?: number | null
          created_at?: string
          created_by?: string
          customer?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          project_manager?: string | null
          project_number?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          role: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      ticket_comments: {
        Row: {
          created_at: string
          created_by: string
          id: string
          text: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          text: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          text?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          priority: string
          project_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description: string
          id?: string
          priority: string
          project_id?: string | null
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          name: string | null
          notifications: boolean | null
          role: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          language?: string | null
          marketing_emails?: boolean | null
          name?: string | null
          notifications?: boolean | null
          role?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          name?: string | null
          notifications?: boolean | null
          role?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      migrate_mock_energy_connections: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "consultant" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "consultant", "client"],
    },
  },
} as const
