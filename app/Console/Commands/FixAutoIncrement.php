<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixAutoIncrement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:fix-autoincrement {table?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix auto-increment issues for database tables';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $table = $this->argument('table') ?? 'applicants';
        
        $this->info("Fixing auto-increment for table: {$table}");
        
        try {
            // Get the current maximum ID
            $maxId = DB::table($table)->max('id') ?? 0;
            $nextId = $maxId + 1;
            
            $this->line("Current max ID: {$maxId}");
            $this->line("Setting next auto-increment to: {$nextId}");
            
            // Reset auto-increment
            DB::statement("ALTER TABLE {$table} AUTO_INCREMENT = {$nextId}");
            
            // Repair and optimize
            DB::statement("REPAIR TABLE {$table}");
            DB::statement("OPTIMIZE TABLE {$table}");
            
            $this->info("✓ Auto-increment fixed successfully for {$table}");
            
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
