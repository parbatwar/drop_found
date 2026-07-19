import enum


class UserRole(str, enum.Enum):
    buyer = "buyer"
    seller = "seller"
    admin = "admin"


class SellerType(str, enum.Enum):
    retailer = "retailer"
    thrift = "thrift"


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
    pending = "pending"                     # Order placed, waiting for seller
    accepted = "accepted"                   # Seller accepted
    rejected = "rejected"                   # Seller rejected the order
    cancelled = "cancelled"                 # Cancelled (before ready_for_pickup)
    ready_for_pickup = "ready_for_pickup"   # Package ready, waiting for delivery person
    picked_up = "picked_up"                 # Delivery person collected the package
    out_for_delivery = "out_for_delivery"   # Delivery person is on the way
    delivered = "delivered"                 # Item delivered to buyer
    completed = "completed"                 # Auto-completed after 7 days


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
