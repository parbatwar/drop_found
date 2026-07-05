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


class ListingCondition(str, enum.Enum):
    like_new = "like_new"
    good = "good"
    fair = "fair"
    okay = "okay"


class ListingStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    sold = "sold"


class ListingSection(str, enum.Enum):
    thrift = "thrift"
    surplus = "surplus"


class ListingCategory(str, enum.Enum):
    tops = "tops"
    dresses = "dresses"
    jacket = "jacket"
    footwear = "footwear"
    accessories = "accessories"
    bags = "bags"
    tshirts = "tshirts"
    shirts = "shirts"
    pants = "pants"
    other = "other"


class ListingSize(str, enum.Enum):
    xs = "xs"
    s = "s"
    m = "m"
    l = "l"
    xl = "xl"
    xxl = "xxl"
    free_size = "free_size"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    delivered = "delivered"
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
