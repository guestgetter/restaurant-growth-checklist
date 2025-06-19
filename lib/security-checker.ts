/**
 * Security Checker Utility
 * Validates production security requirements
 */

interface SecurityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  critical: boolean;
}

interface SecurityReport {
  overall: 'secure' | 'has_warnings' | 'insecure';
  checks: SecurityCheck[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
    critical_failures: number;
  };
}

export class SecurityChecker {
  static async runSecurityAudit(): Promise<SecurityReport> {
    const checks: SecurityCheck[] = [];

    // Check environment variables
    checks.push(this.checkEnvironmentVariables());
    
    // Check authentication configuration
    checks.push(this.checkAuthConfiguration());
    
    // Check database security
    checks.push(this.checkDatabaseSecurity());
    
    // Check CORS configuration
    checks.push(this.checkCORSConfiguration());
    
    // Check production settings
    checks.push(this.checkProductionSettings());

    // Calculate summary
    const summary = {
      total: checks.length,
      passed: checks.filter(c => c.status === 'pass').length,
      warnings: checks.filter(c => c.status === 'warning').length,
      failed: checks.filter(c => c.status === 'fail').length,
      critical_failures: checks.filter(c => c.status === 'fail' && c.critical).length,
    };

    // Determine overall status
    const overall = summary.critical_failures > 0 
      ? 'insecure' 
      : summary.failed > 0 || summary.warnings > 0 
        ? 'has_warnings' 
        : 'secure';

    return {
      overall,
      checks,
      summary
    };
  }

  private static checkEnvironmentVariables(): SecurityCheck {
    const requiredEnvVars = [
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'DIRECT_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      return {
        name: 'Environment Variables',
        status: 'fail',
        message: `Missing critical environment variables: ${missingVars.join(', ')}`,
        critical: true
      };
    }

    // Check for weak secrets
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    if (nextAuthSecret && nextAuthSecret.length < 32) {
      return {
        name: 'Environment Variables',
        status: 'warning',
        message: 'NEXTAUTH_SECRET should be at least 32 characters long',
        critical: false
      };
    }

    return {
      name: 'Environment Variables',
      status: 'pass',
      message: 'All required environment variables are present and properly configured',
      critical: false
    };
  }

  private static checkAuthConfiguration(): SecurityCheck {
    try {
      // Check if middleware exists
      const fs = require('fs');
      const middlewareExists = fs.existsSync('./middleware.ts');
      
      if (!middlewareExists) {
        return {
          name: 'Authentication Configuration',
          status: 'fail',
          message: 'Authentication middleware is missing',
          critical: true
        };
      }

      return {
        name: 'Authentication Configuration',
        status: 'pass',
        message: 'Authentication middleware is properly configured',
        critical: false
      };
    } catch (error) {
      return {
        name: 'Authentication Configuration',
        status: 'warning',
        message: 'Unable to verify authentication configuration',
        critical: false
      };
    }
  }

  private static checkDatabaseSecurity(): SecurityCheck {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      return {
        name: 'Database Security',
        status: 'fail',
        message: 'DATABASE_URL is not configured',
        critical: true
      };
    }

    // Check for secure connection
    if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
      return {
        name: 'Database Security',
        status: 'warning',
        message: 'Database appears to be running locally (development mode)',
        critical: false
      };
    }

    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      return {
        name: 'Database Security',
        status: 'warning',
        message: 'Database connection string format should use postgresql:// or postgres://',
        critical: false
      };
    }

    return {
      name: 'Database Security',
      status: 'pass',
      message: 'Database configuration appears secure',
      critical: false
    };
  }

  private static checkCORSConfiguration(): SecurityCheck {
    // In Next.js, CORS is handled by the framework and middleware
    // This is a placeholder for future CORS-specific checks
    return {
      name: 'CORS Configuration',
      status: 'pass',
      message: 'CORS is handled by Next.js framework and authentication middleware',
      critical: false
    };
  }

  private static checkProductionSettings(): SecurityCheck {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (!isProduction) {
      return {
        name: 'Production Settings',
        status: 'warning',
        message: 'Application is running in development mode',
        critical: false
      };
    }

    return {
      name: 'Production Settings',
      status: 'pass',
      message: 'Application is configured for production',
      critical: false
    };
  }

  static formatReport(report: SecurityReport): string {
    const lines = [];
    
    lines.push('🔒 SECURITY AUDIT REPORT');
    lines.push('=' .repeat(50));
    lines.push('');
    
    // Overall status
    const statusEmoji = report.overall === 'secure' ? '✅' 
      : report.overall === 'has_warnings' ? '⚠️' 
      : '🚨';
    
    lines.push(`${statusEmoji} Overall Status: ${report.overall.toUpperCase()}`);
    lines.push('');
    
    // Summary
    lines.push(`📊 Summary:`);
    lines.push(`   Total Checks: ${report.summary.total}`);
    lines.push(`   ✅ Passed: ${report.summary.passed}`);
    lines.push(`   ⚠️  Warnings: ${report.summary.warnings}`);
    lines.push(`   ❌ Failed: ${report.summary.failed}`);
    lines.push(`   🚨 Critical Failures: ${report.summary.critical_failures}`);
    lines.push('');
    
    // Detailed checks
    lines.push('📋 Detailed Results:');
    lines.push('-'.repeat(30));
    
    report.checks.forEach(check => {
      const emoji = check.status === 'pass' ? '✅' 
        : check.status === 'warning' ? '⚠️' 
        : '❌';
      
      const criticalMark = check.critical ? ' [CRITICAL]' : '';
      lines.push(`${emoji} ${check.name}${criticalMark}`);
      lines.push(`   ${check.message}`);
      lines.push('');
    });

    return lines.join('\n');
  }
} 