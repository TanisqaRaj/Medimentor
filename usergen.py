import json
import random

# Sample data for random generation
first_names = ["Riya", "Aryan", "Kavya", "Sahil", "Priya", "Arjun", "Meera", "Rahul", "Isha", "Vikas"]
last_names = ["Patel", "Sharma", "Mehta", "Gupta", "Desai", "Verma", "Chopra", "Malhotra", "Singh", "Agarwal"]
professions = [
    "General Physician", "Cardiologist", "Surgeon", "Pediatrician", "Dermatologist",
    "Gynecologist", "Orthopedic Surgeon", "Neurologist", "Ophthalmologist", "Dentist", "ENT Specialist"
]
genders = ["male", "female"]
departments = {
    "General Physician": "General Medicine",
    "Cardiologist": "Cardiology",
    "Surgeon": "Surgery",
    "Pediatrician": "Pediatrics",
    "Dermatologist": "Dermatology",
    "Gynecologist": "Gynecology",
    "Orthopedic Surgeon": "Orthopedics",
    "Neurologist": "Neurology",
    "Ophthalmologist": "Ophthalmology",
    "Dentist": "Dentistry",
    "ENT Specialist": "Otolaryngology"
}

# Generate 50 sample entries
data = []
for i in range(100):
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    profession = random.choice(professions)
    gender = random.choice(genders)
    experience = random.randint(1, 40)
    phone = f"98{random.randint(10000000, 99999999)}"
    email = f"{first_name.lower()}.{last_name.lower()}@example.com"
    username = f"{first_name[0].lower()}{last_name.lower()}"
    certificate = f"https://example.com/certificates/cert{random.randint(1000, 9999)}.pdf"
    bio = f"{profession} specializing in {departments[profession].lower()}."
    image = f"https://example.com/images/{first_name.lower()}_{last_name.lower()}.jpg"
    mci_number = f"MCI{random.randint(100000, 999999)}"
    password = f"securepassword{random.randint(100, 999)}"
    
    data.append({
        "name": f"Dr. {first_name} {last_name}",
        "phone": phone,
        "email": email,
        "username": username,
        "certificate": certificate,
        "bio": bio,
        "image": image,
        "profession": profession,
        "gender": gender,
        "experience": experience,
        "department": departments[profession],
        "mciNumber": mci_number,
        "password": password
    })

# Convert to JSON format
json_data = json.dumps(data, indent=2)

# Save to file
output_file = "./sample_data1.json"
with open(output_file, "w") as file:
    file.write(json_data)

output_file
