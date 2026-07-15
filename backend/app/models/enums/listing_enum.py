import enum


class Gender(str, enum.Enum):
    men = "men"
    women = "women"
    unisex = "unisex"
    kids = "kids"


class ListingCondition(str, enum.Enum):
    like_new = "like_new"
    good = "good"
    okay = "okay"
    used = "used"


class ListingStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    sold = "sold"


class ListingSize(str, enum.Enum):
    xs = "xs"
    s = "s"
    m = "m"
    l = "l"
    xl = "xl"
    xxl = "xxl"
    free_size = "free_size"


class ListingColor(str, enum.Enum):
    black = "black"
    white = "white"
    red = "red"
    blue = "blue"
    green = "green"
    yellow = "yellow"
    purple = "purple"
    pink = "pink"
    brown = "brown"
    gray = "gray"
    maroon = "maroon"
    navy = "navy"
    beige = "beige"
