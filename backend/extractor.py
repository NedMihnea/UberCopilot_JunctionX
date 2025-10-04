import pandas as pd

source_file = "uber_hackathon_v2_mock_data.xlsx"
output_file = "earners_min.csv"

df = pd.read_excel(source_file)

columns_needed = [
    "earner_id",
    "earner_type",
    "vehicle_type",
    "fuel_type",
    "is_ev",
    "experience_months",
    "rating",
    "status",
    "home_city_id"
]

df_small = df[columns_needed].copy()
df_small.to_csv(output_file, index=False)

print("✅ Done! Extracted data saved as:", output_file)
print("Rows:", len(df_small))
print("Columns:", df_small.columns.tolist())