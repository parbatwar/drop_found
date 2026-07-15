import enum


class UserRole(str, enum.Enum):
    buyer = "buyer"
    seller = "seller"
    admin = "admin"


class SellerType(str, enum.Enum):
    thrift = "thrift"
    surplus = "surplus"


class VerificationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class SocialPlatform(str, enum.Enum):
    facebook = "facebook"
    google = "google"
    twitter = "twitter"
    instagram = "instagram"
    tiktok = "tiktok"
    website = "website"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    shipped = "shipped"
    delivered = "delivered"
    rejected = "rejected"
    cancelled = "cancelled"


class PaymentMethod(str, enum.Enum):
    esewa = "esewa"
    khalti = "khalti"
    cod = "cod"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    success = "success"
    failed = "failed"


class PayoutStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"


class BusinessType(str, enum.Enum):
    brand = "brand"
    retailer = "retailer"
