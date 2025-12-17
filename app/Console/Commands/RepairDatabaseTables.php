<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RepairDatabaseTables extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:repair {--table= : Specific table to repair}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Repair and optimize database tables to fix auto-increment issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting database repair and optimization...');
        
        $tables = $this->option('table') 
            ? [$this->option('table')] 
            : ['applicants', 'admission_sessions', 'uploads', 'pdf_logs', 'users', 'applicant_users'];

        foreach ($tables as $table) {
            $this->info("Processing table: {$table}");
            
            try {
                // Check table
                $this->line("  - Checking table...");
                DB::statement("CHECK TABLE {$table}");
                
                // Repair table
                $this->line("  - Repairing table...");
                DB::statement("REPAIR TABLE {$table}");
                
                // Optimize table
                $this->line("  - Optimizing table...");
                DB::statement("OPTIMIZE TABLE {$table}");
                
                // Analyze table
                $this->line("  - Analyzing table...");
                DB::statement("ANALYZE TABLE {$table}");
                
                $this->info("  ✓ {$table} repaired successfully");
                
            } catch (\Exception $e) {
                $this->error("  ✗ Error repairing {$table}: " . $e->getMessage());
            }
        }
        
        $this->newLine();
        $this->info('Database repair completed!');
        $this->info('You may need to restart your MySQL/MariaDB service for changes to take full effect.');
        
        return 0;
    }
}
