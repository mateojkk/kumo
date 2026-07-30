export function extractField(body: any, field: string): any {
  if (!body) return undefined;
  
  // 1. Direct access
  if (body[field] !== undefined) return body[field];
  
  // 2. Common wrappers (data, params, payload, body)
  const wrappers = ['data', 'params', 'payload', 'body', 'serviceParams', 'request'];
  for (const wrapper of wrappers) {
    if (body[wrapper]) {
      // If the wrapper is a JSON string (often true for OKX A2A x402 replays)
      if (typeof body[wrapper] === 'string') {
        try {
          const parsed = JSON.parse(body[wrapper]);
          if (parsed && parsed[field] !== undefined) {
            return parsed[field];
          }
        } catch (e) {
          // Ignore parse errors, it might just be a regular string
        }
      } else if (typeof body[wrapper] === 'object') {
        // If the wrapper is already an object
        if (body[wrapper][field] !== undefined) {
          return body[wrapper][field];
        }
        
        // Deep search inside wrapper.body if the wrapper itself wraps it again (e.g. request.body)
        if (body[wrapper].body) {
           if (typeof body[wrapper].body === 'string') {
               try {
                   const parsed = JSON.parse(body[wrapper].body);
                   if (parsed && parsed[field] !== undefined) return parsed[field];
               } catch (e) {}
           } else if (typeof body[wrapper].body === 'object' && body[wrapper].body[field] !== undefined) {
               return body[wrapper].body[field];
           }
        }
      }
    }
  }
  
  return undefined;
}
