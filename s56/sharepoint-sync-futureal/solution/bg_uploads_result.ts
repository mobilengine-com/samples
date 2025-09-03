const result = params as SharepointFileExchangeTaskResult;
Log(['Failed uploads:', result.uploads.filter(u => u.success === false)]);
Log(['Successful uploads:', result.uploads.filter(u => u.success === true)]);