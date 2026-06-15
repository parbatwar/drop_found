from slugify import slugify

# def generate_slug(shopname: str):
#     new_name = shopname.lower().replace(" ", "-")
#     return new_name


def generate_slug(shopname: str) -> str:
    return slugify(shopname)
