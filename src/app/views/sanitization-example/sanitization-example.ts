import { Component } from '@angular/core';
import { HtmlSanitizationPipe } from '../../core/pipes/html-sanitizaton-pipe/html-sanitization-pipe';
import { DomSanitizer, SafeHtml, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sanitization-example',
  imports: [HtmlSanitizationPipe],
  templateUrl: './sanitization-example.html',
  styleUrl: './sanitization-example.css'
})
export class SanitizationExample {
  safeHtml: SafeHtml;
  safeStyle: SafeStyle;
  safeScript: SafeScript;
  safeUrl: SafeUrl;
  userInput = `
    <p><b>Normal text</b></p>

    <!-- URL Injection -->
    <a href="javascript:alert('URL Hack!')">Click me (URL)</a>

    <!-- Style Injection -->
    <div style="background-color: red; color: white">
      Box with malicious style
    </div>

    <!-- Script Injection -->
    <script>alert("Script Hack!");</script>
  `;
  constructor(private sanitizer: DomSanitizer){
    const maliciousHtml = `<a href="javascript:alert('Hacked HTML!')">Click me</a>`;
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(maliciousHtml);

    const maliciousStyle = `background-image: url('https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg'); height: 100px;`;
    this.safeStyle = this.sanitizer.bypassSecurityTrustStyle(maliciousStyle);

    const maliciousScript = `alert("Hacked Script!");`;
    this.safeScript = this.sanitizer.bypassSecurityTrustScript(maliciousScript);

    const maliciousUrl = `javascript:alert('Hacked URL!')`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(maliciousUrl);
  }
}
