import re
import os

# List of HTML files to process
html_files = [
    r'c:\Users\INTELENSE\Desktop\intelense website\index.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\kenvision.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\keniot.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\kenrobotics.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\kenagri.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\kenhome.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\kensafety.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\about.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\faq.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\contact.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\privacy.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\terms.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\blogs.html',
    r'c:\Users\INTELENSE\Desktop\intelense website\ken360.html',
]

def remove_center_alignment(content, filename):
    """Remove text-align: center from section titles, except use cases"""
    lines = content.split('\n')
    modified_lines = []
    
    for i, line in enumerate(lines):
        # Check if this is a use cases section (skip it)
        context = '\n'.join(lines[max(0, i-5):min(len(lines), i+5)])
        is_use_case = 'use-cases' in context.lower() or 'use cases' in context.lower()
        
        # If it's a reveal div with text-align: center and NOT a use case section
        if 'class="reveal"' in line and 'text-align: center' in line and not is_use_case:
            # Remove text-align: center from the style attribute
            line = re.sub(r'text-align:\s*center;?\s*', '', line)
            # Clean up empty style attributes or trailing semicolons
            line = re.sub(r'style="\s*;?\s*"', '', line)
            line = re.sub(r';\s*;', ';', line)
            line = re.sub(r'style="\s*;', 'style="', line)
            line = re.sub(r';\s*"', '"', line)
        
        modified_lines.append(line)
    
    return '\n'.join(modified_lines)

# Process each file
for filepath in html_files:
    if os.path.exists(filepath):
        print(f"Processing {os.path.basename(filepath)}...")
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified_content = remove_center_alignment(content, filepath)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        
        print(f"✓ Updated {os.path.basename(filepath)}")
    else:
        print(f"✗ File not found: {filepath}")

print("\nDone! All section titles have been left-aligned (except use cases).")
