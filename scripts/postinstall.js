#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 配置 Claude CLI 代理包装器...');

try {
  // 确保 bin 文件可执行
  const binPath = path.join(__dirname, '..', 'bin', 'claude-wrapper.js');
  if (fs.existsSync(binPath)) {
    fs.chmodSync(binPath, '755');
  }
  
  // 确保 vendor 目录中的文件有正确权限
  const vendorDir = path.join(__dirname, '..', 'vendor');
  const claudeCodeDir = path.join(vendorDir, 'claude-code');
  
  if (fs.existsSync(claudeCodeDir)) {
    console.log('📦 检查内置 Claude CLI...');
    
    // 设置 CLI 文件权限
    const cliPath = path.join(claudeCodeDir, 'cli.js');
    if (fs.existsSync(cliPath)) {
      fs.chmodSync(cliPath, '755');
      console.log('✅ 内置 Claude CLI 配置成功');
    }
    
    // 设置 bin 目录权限（如果存在）
    const binDir = path.join(claudeCodeDir, 'bin');
    if (fs.existsSync(binDir)) {
      try {
        execSync(`chmod -R +x "${binDir}"`, { stdio: 'pipe' });
      } catch (e) {
        // 忽略权限设置错误
      }
    }
    
    // 验证 package.json 存在
    const pkgPath = path.join(claudeCodeDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      console.log(`📌 内置 Claude CLI 版本: ${pkg.version || 'unknown'}`);
    }
  } else {
    console.warn('⚠️  未找到内置 Claude CLI，将尝试使用系统安装');
  }
  
  console.log('✅ 配置完成！');
  console.log('');
  console.log('📋 使用说明:');
  console.log('   直接运行: claude');
  console.log('');
  console.log('🔄 代理配置:');
  console.log('');
  console.log('📦 此版本包含内置的 Claude CLI，无需额外安装');
  
} catch (error) {
  console.error('❌ 配置失败:', error.message);
}