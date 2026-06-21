import {trace } from '@opentelemetry/api';
import { createClient } from '@supabase/supabase-js';   
import config from '.';


export const supabase = createClient(
    config.databaseURL,
    config.dbSecret
);

export const tracer = trace.getTracer('kita-service');