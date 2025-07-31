import pandas as pd
import json

# Read the Excel file
excel_file = 'docs/sheets/evals.xlsx'

try:
    # Read the written_comments sheet
    df = pd.read_excel(excel_file, sheet_name='written_comments')
    
    # Filter for rows that have a number in the rank column
    # Remove NaN values and ensure rank is numeric
    df_ranked = df.dropna(subset=['rank'])
    df_ranked = df_ranked[pd.to_numeric(df_ranked['rank'], errors='coerce').notna()]
    
    # Sort by rank
    df_ranked = df_ranked.sort_values('rank')
    
    # Extract the required columns
    comments_data = []
    for _, row in df_ranked.iterrows():
        comments_data.append({
            'course': str(row.get('course', '')),
            'term': str(row.get('term', '')),
            'comment': str(row.get('comment', '')),
            'rank': int(float(row['rank']))
        })
    
    # Print the data as JSON for easy parsing
    print(json.dumps(comments_data, indent=2))
    
except Exception as e:
    print(f"Error reading Excel file: {e}")
    print("Available sheets:")
    try:
        xl_file = pd.ExcelFile(excel_file)
        print(xl_file.sheet_names)
    except:
        print("Could not read Excel file")