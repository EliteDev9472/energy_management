
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailLog {
  date: string;
  recipient: string;
  subject: string;
  type: 'grid_operator_request' | 'client_confirmation' | 'offer_request' | 'status_update';
  content?: string;
}

interface RequestBody {
  connectionRequestId: string;
  emailLog: EmailLog;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if this is a POST request
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }

  try {
    // Parse the request body
    const { connectionRequestId, emailLog }: RequestBody = await req.json();

    // Validate the input
    if (!connectionRequestId || !emailLog || !emailLog.recipient || !emailLog.subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // In a real application, you would use a proper email service like Resend
    // For now, we'll just log the email and save it to the database
    
    console.log(`Email to: ${emailLog.recipient}`);
    console.log(`Subject: ${emailLog.subject}`);
    console.log(`Content: ${emailLog.content}`);

    // Store the email log in the database
    const { data, error } = await supabase
      .from('connection_request_email_logs')
      .insert({
        connection_request_id: connectionRequestId,
        date: emailLog.date,
        recipient: emailLog.recipient,
        subject: emailLog.subject,
        type: emailLog.type,
        content: emailLog.content
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving email log:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save email log' }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // In a real scenario, here we would send the actual email using something like Resend
    // For now, we'll simulate a successful email send
    const successfulSend = true;

    if (successfulSend) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully',
          logId: data.id
        }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
