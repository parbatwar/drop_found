import enum


class UserRole(enum.Enum):
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"


class VerificationStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class SocialPlatform(enum.Enum):
    FACEBOOK = "facebook"
    GOOGLE = "google"
    TWITTER = "twitter"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    WEBSITE = "website"


class ListingCondition(enum.Enum):
    LIKE_NEW = "like_new"
    GOOD = "good"
    FAIR = "fair"
    OKAY = "okay"


class ListingStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SOLD = "sold"


class ListingSection(enum.Enum):
    THRIFT = "thrift"
    SURPLUS = "surplus"


class ListingCategory(enum.Enum):
    TOPS = "tops"
    DRESSES = "dresses"
    JACKET = "jacket"
    FOOTWEAR = "footwear"
    ACCESSORIES = "accessories"
    BAGS = "bags"
    TSHIRTS = "tshirts"
    SHIRTS = "shirts"
    PANTS = "pants"
    OTHER = "other"


class ListingSize(enum.Enum):
    XS = "xs"
    S = "s"
    M = "m"
    L = "l"
    XL = "xl"
    XXL = "xxl"
    FREE_SIZE = "free_size"


class OrderStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class DeliveryMethod(enum.Enum):
    SELLER = "seller"
    COURIER = "courier"


class PaymentMethod(enum.Enum):
    ESEWA = "esewa"
    KHALTI = "khalti"
    COD = "cod"


class PaymentStatus(enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"


class PayoutStatus(enum.Enum):
    PENDING = "pending"
    PAID = "paid"


class BusinessType(enum.Enum):
    BRAND = "brand"
    RETAILER = "retailer"
