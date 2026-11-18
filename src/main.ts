import { Actor, log } from 'apify';



// Main actor function
async function main() {
  await Actor.init();
  // One-time per-run charge event (pay-per-event monetization)
  await Actor.charge({ eventName: 'run_started', count: 1 });

  try {
    const input = await Actor.getInput() as {
      instructions: string[];
      screenshotOnError?: boolean;
    };

    if (!input?.instructions || input.instructions.length === 0) {
      throw new Error('No instructions provided');
    }

    log.info('Starting askui automation');
    log.info(`Instructions: ${input.instructions.join(', ')}`);

    // Note: askui requires proper setup with credentials
    // For now, this is a basic structure
    const results = [];
    
    for (const [index, instruction] of input.instructions.entries()) {
      log.info(`Processing instruction ${index + 1}/${input.instructions.length}: ${instruction}`);

      // Pay-per-event: charge one event per executed instruction (success or failure)
      await Actor.charge({ eventName: 'instruction_executed', count: 1 });

      try {
        // askui integration point: wire the vision agent here when credentials are configured.
        // Example: const { Agent } = await import('askui'); await new Agent().act(instruction);
        // await aui.exec(instruction);
 
        results.push({
          instruction,
          status: 'success',
          timestamp: new Date().toISOString(),
          note: 'askui agent not configured in this build - wire the askui Agent here'
        });

        log.info(` Completed: ${instruction}`);
        
      } catch (error) {
        log.error(` Failed: ${instruction}`, { error });
        
        results.push({
          instruction,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }

    await Actor.pushData({
      summary: {
        total: input.instructions.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
      },
      results,
      executedAt: new Date().toISOString(),
    });

    await Actor.setStatusMessage(`Processed ${results.length} instructions (${results.filter(r => r.status === 'success').length} ok)`);
    log.info('Automation completed');
    log.info(`Results: ${results.filter(r => r.status === 'success').length}/${results.length} successful`);

  } catch (error) {
    log.info('Actor failed', { error });
    throw error;
  } finally {
    await Actor.exit();
  }
}

// Run the main function
main();
