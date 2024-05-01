import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data with mixed types
data = {
    'Values': [12, 15, 16, 18, 20],  
    'Origin': ['Guatemala', 'United States of America', 'France', 'Japan', 'Canada'],  
    'Category': ['Green', 'Blue', 'Red', 'Yellow', 'Orange'],  
    'Cost': ['$400 M', '$1.2 B', '$600.5 M', '$750M', '$2.5 B'],  
    'Current Owner': ['Rick Grimes', 'Joel Klatt', 'Travis Outlaw', 'Alice Johnson', 'Bob Smith']  
}

df = pd.DataFrame(data)

# Cleaning special characters from 'Cost' column
df['Cost'] = df['Cost'].str.replace(r'[^0-9.]+', '').str.strip()

# Function to replace characters with numeric values if they are the only non-numeric character and at the end
def replace_abbreviations(x):
    if x[-1] in ['K', 'M', 'B', 'T']:
        applied = float(x[:-1].replace('$', '').replace(',', '').replace(' ', ''))
        return applied * {'K': 1000, 'M': 1000000, 'B': 1000000000, 'T': 1000000000000}[x[-1]]
    return x

# Applying the function to 'Cost' column
df['Cost'] = df['Cost'].apply(replace_abbreviations)

# Convert 'Cost' column to numeric
df['Cost'] = pd.to_numeric(df['Cost'])

# Plotting
plt.figure(figsize=(10, 6))
sns.barplot(data=df, x='Category', y='Cost', ci=None)
plt.title('Cost per Category')
plt.xlabel('Category')
plt.ylabel('Cost')
plt.xticks(rotation=45)
plt.show()
