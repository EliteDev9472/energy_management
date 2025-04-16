import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/formatters";

export interface BillingItem {
  id: string;
  organization_id: string;
  type: 'project' | 'connection' | 'monthly';
  status: 'pending' | 'invoiced' | 'paid' | 'cancelled';
  amount: number;
  reference_id: string;
  reference_type: string;
  reference_name: string;
  billable_from: string;
  last_billed_month?: string;
  invoice_id?: string;
  created_at: string;
}

export const billingService = {
  // Get all billable items for an organization
  async getBillableItems(organizationId: string): Promise<BillingItem[]> {
    const { data, error } = await supabase
      .from('billing_items')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching billable items:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Get unbilled items for an organization
  async getUnbilledItems(organizationId: string): Promise<BillingItem[]> {
    const { data, error } = await supabase
      .from('billing_items')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching unbilled items:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Create a new billable item
  async createBillableItem(billableItem: Omit<BillingItem, 'id' | 'created_at'>): Promise<BillingItem> {
    const { data, error } = await supabase
      .from('billing_items')
      .insert(billableItem)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating billable item:', error);
      throw error;
    }
    
    return data;
  },
  
  // Update a billable item
  async updateBillableItem(id: string, updates: Partial<BillingItem>): Promise<BillingItem> {
    const { data, error } = await supabase
      .from('billing_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating billable item:', error);
      throw error;
    }
    
    return data;
  },
  
  // Create an invoice from selected billable items
  async createInvoice(organizationId: string, itemIds: string[]): Promise<string> {
    // First, create the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('organization_invoices')
      .insert({
        organization_id: organizationId,
        invoice_number: `INV-${Date.now().toString().substr(-6)}`,
        title: `Factuur ${formatDate(new Date())}`,
        status: 'pending',
        payment_type: 'bank_transfer',
        amount: 0, // Will be updated with the sum of all items
        issue_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Due in 14 days
      })
      .select()
      .single();
    
    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      throw invoiceError;
    }
    
    // Now get the selected items to calculate the total amount
    const { data: items, error: itemsError } = await supabase
      .from('billing_items')
      .select('*')
      .in('id', itemIds);
    
    if (itemsError) {
      console.error('Error fetching selected billing items:', itemsError);
      throw itemsError;
    }
    
    // Calculate the total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    // Update the invoice with the correct amount
    const { error: updateError } = await supabase
      .from('organization_invoices')
      .update({ amount: totalAmount })
      .eq('id', invoice.id);
    
    if (updateError) {
      console.error('Error updating invoice amount:', updateError);
      throw updateError;
    }
    
    // Update the billable items to link them to the invoice
    const { error: updateItemsError } = await supabase
      .from('billing_items')
      .update({ 
        status: 'invoiced',
        invoice_id: invoice.id
      })
      .in('id', itemIds);
    
    if (updateItemsError) {
      console.error('Error updating billable items:', updateItemsError);
      throw updateItemsError;
    }
    
    return invoice.id;
  },
  
  // Check for project costs that need to be billed
  async checkForNewProjectBillingItems(organizationId: string): Promise<number> {
    // Get all projects for this organization that don't have billable items yet
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, category_id, categories!inner(*), categories.entities!inner(*), categories.entities.organizations!inner(*)')
      .eq('categories.entities.organizations.id', organizationId)
      .not('id', 'in', `(
        SELECT reference_id FROM billing_items 
        WHERE organization_id = '${organizationId}' 
        AND type = 'project'
      )`);
    
    if (projectsError) {
      console.error('Error fetching unbilled projects:', projectsError);
      throw projectsError;
    }
    
    if (!projects || projects.length === 0) {
      return 0;
    }
    
    // Create billable items for each new project
    const newBillableItems = projects.map(project => ({
      organization_id: organizationId,
      type: 'project' as const,
      status: 'pending' as const,
      amount: 500, // €500 fixed fee for new projects
      reference_id: project.id,
      reference_type: 'project',
      reference_name: project.name,
      billable_from: new Date().toISOString(),
    }));
    
    const { error: insertError } = await supabase
      .from('billing_items')
      .insert(newBillableItems);
    
    if (insertError) {
      console.error('Error creating project billing items:', insertError);
      throw insertError;
    }
    
    return newBillableItems.length;
  },
  
  // Check for connection costs that need to be billed
  async checkForNewConnectionBillingItems(organizationId: string): Promise<number> {
    // Get all energy connections with status "IN_PROGRESS" that don't have billable items yet
    const { data: connections, error: connectionsError } = await supabase
      .from('energy_connections')
      .select('*, objects!inner(*, complexes!inner(*, projects!inner(*, categories!inner(*, entities!inner(*, organizations!inner(*)))))))')
      .eq('status', 'IN_PROGRESS')
      .eq('objects.complexes.projects.categories.entities.organizations.id', organizationId)
      .not('id', 'in', `(
        SELECT reference_id FROM billing_items 
        WHERE organization_id = '${organizationId}' 
        AND type = 'connection'
      )`);
    
    if (connectionsError) {
      console.error('Error fetching unbilled connections:', connectionsError);
      throw connectionsError;
    }
    
    if (!connections || connections.length === 0) {
      return 0;
    }
    
    // Create billable items for each new connection in progress
    const newBillableItems = connections.map(connection => ({
      organization_id: organizationId,
      type: 'connection' as const,
      status: 'pending' as const,
      amount: 100, // €100 fixed fee for connections in progress
      reference_id: connection.id,
      reference_type: 'connection',
      reference_name: `${connection.address}, ${connection.city}`,
      billable_from: connection.in_progress_date || new Date().toISOString(),
    }));
    
    const { error: insertError } = await supabase
      .from('billing_items')
      .insert(newBillableItems);
    
    if (insertError) {
      console.error('Error creating connection billing items:', insertError);
      throw insertError;
    }
    
    return newBillableItems.length;
  },
  
  // Check for monthly EAN charges that need to be billed
  async checkForMonthlyEANBillingItems(organizationId: string): Promise<number> {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Get all active energy connections with EANs that haven't been billed for the current month
    const { data: connections, error: connectionsError } = await supabase
      .from('energy_connections')
      .select('*, objects!inner(*, complexes!inner(*, projects!inner(*, categories!inner(*, entities!inner(*, organizations!inner(*)))))))')
      .eq('is_active_subscription', true)
      .not('ean', 'is', null)
      .eq('objects.complexes.projects.categories.entities.organizations.id', organizationId)
      .not('id', 'in', `(
        SELECT reference_id FROM billing_items 
        WHERE organization_id = '${organizationId}' 
        AND type = 'monthly'
        AND last_billed_month = '${currentMonth}'
      )`);
    
    if (connectionsError) {
      console.error('Error fetching unbilled monthly EANs:', connectionsError);
      throw connectionsError;
    }
    
    if (!connections || connections.length === 0) {
      return 0;
    }
    
    // Get the organization's monthly EAN rate
    const { data: orgDetails, error: orgError } = await supabase
      .from('organization_financial_details')
      .select('monthly_ean_rate')
      .eq('organization_id', organizationId)
      .single();
    
    if (orgError) {
      console.error('Error fetching organization monthly rate:', orgError);
      throw orgError;
    }
    
    const monthlyRate = orgDetails?.monthly_ean_rate || 25; // Default to €25 if not specified
    
    // Create billable items for each active connection with EAN
    const newBillableItems = connections.map(connection => ({
      organization_id: organizationId,
      type: 'monthly' as const,
      status: 'pending' as const,
      amount: monthlyRate,
      reference_id: connection.id,
      reference_type: 'ean',
      reference_name: `${connection.ean} (${connection.address}, ${connection.city})`,
      billable_from: connection.activation_date || new Date().toISOString(),
      last_billed_month: currentMonth,
    }));
    
    const { error: insertError } = await supabase
      .from('billing_items')
      .insert(newBillableItems);
    
    if (insertError) {
      console.error('Error creating monthly EAN billing items:', insertError);
      throw insertError;
    }
    
    return newBillableItems.length;
  },
  
  // Get organization billing settings
  async getOrganizationBillingSettings(organizationId: string) {
    const { data, error } = await supabase
      .from('organization_financial_details')
      .select('*')
      .eq('organization_id', organizationId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching organization billing settings:', error);
      throw error;
    }
    
    return data || {
      organization_id: organizationId,
      monthly_ean_rate: 25,
    };
  },
  
  // Update organization billing settings
  async updateOrganizationBillingSettings(organizationId: string, updates: any) {
    const { data: existingSettings } = await supabase
      .from('organization_financial_details')
      .select('id')
      .eq('organization_id', organizationId)
      .single();
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('organization_financial_details')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('organization_id', organizationId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating organization billing settings:', error);
        throw error;
      }
      
      return data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('organization_financial_details')
        .insert({
          organization_id: organizationId,
          ...updates,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating organization billing settings:', error);
        throw error;
      }
      
      return data;
    }
  },
  
  // Create billing item for project costs
  async createProjectBillingItem(project: { id: string; name: string; organization_id: string }): Promise<BillingItem> {
    const billingItem: Omit<BillingItem, 'id'> = {
      organization_id: project.organization_id,
      type: 'project',
      status: 'pending',
      amount: 500, // Fixed project cost
      reference_id: project.id,
      reference_type: 'project',
      reference_name: project.name,
      billable_from: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('billing_items')
      .insert(billingItem)
      .select()
      .single();

    if (error) {
      console.error('Error creating project billing item:', error);
      throw error;
    }

    return data;
  },

  // Create billing item for connection costs
  async createConnectionBillingItem(connection: { 
    id: string; 
    address: string; 
    city: string; 
    organization_id: string 
  }): Promise<BillingItem> {
    const billingItem: Omit<BillingItem, 'id'> = {
      organization_id: connection.organization_id,
      type: 'connection',
      status: 'pending',
      amount: 100, // Fixed connection cost
      reference_id: connection.id,
      reference_type: 'connection',
      reference_name: `${connection.address}, ${connection.city}`,
      billable_from: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('billing_items')
      .insert(billingItem)
      .select()
      .single();

    if (error) {
      console.error('Error creating connection billing item:', error);
      throw error;
    }

    return data;
  },

  // Create monthly billing item for active connections
  async createMonthlyConnectionBillingItem(connection: { 
    id: string; 
    ean: string; 
    address: string; 
    city: string; 
    organization_id: string 
  }, monthlyRate: number): Promise<BillingItem> {
    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    const billingItem: Omit<BillingItem, 'id'> = {
      organization_id: connection.organization_id,
      type: 'monthly',
      status: 'pending',
      amount: monthlyRate,
      reference_id: connection.id,
      reference_type: 'ean',
      reference_name: `${connection.ean} (${connection.address}, ${connection.city})`,
      billable_from: new Date().toISOString(),
      last_billed_month: currentMonth,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('billing_items')
      .insert(billingItem)
      .select()
      .single();

    if (error) {
      console.error('Error creating monthly connection billing item:', error);
      throw error;
    }

    return data;
  },
};
