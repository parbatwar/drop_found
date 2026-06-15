import enum


class UserRole(str, enum.Enum):
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"


class SellerType(str, enum.Enum):
    THRIFT = "thrift"
    SURPLUS = "surplus"


class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class SocialPlatform(str, enum.Enum):
    FACEBOOK = "facebook"
    GOOGLE = "google"
    TWITTER = "twitter"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    WEBSITE = "website"


class ListingCondition(str, enum.Enum):
    LIKE_NEW = "like_new"
    GOOD = "good"
    FAIR = "fair"
    OKAY = "okay"


class ListingStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SOLD = "sold"


class ListingSection(str, enum.Enum):
    THRIFT = "thrift"
    SURPLUS = "surplus"


class ListingCategory(str, enum.Enum):
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


class ListingSize(str, enum.Enum):
    XS = "xs"
    S = "s"
    M = "m"
    L = "l"
    XL = "xl"
    XXL = "xxl"
    FREE_SIZE = "free_size"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class DeliveryMethod(str, enum.Enum):
    SELLER = "seller"
    COURIER = "courier"


class PaymentMethod(str, enum.Enum):
    ESEWA = "esewa"
    KHALTI = "khalti"
    COD = "cod"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"


class PayoutStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"


class BusinessType(str, enum.Enum):
    BRAND = "brand"
    RETAILER = "retailer"
