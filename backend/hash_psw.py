from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

password = "user123"

hashed = pwd_context.hash(password)

print(hashed)