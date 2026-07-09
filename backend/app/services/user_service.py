class UserService:

    @staticmethod
    @staticmethod
    def update_profile(data, current_user, db):
        user = current_user

        if data.first_name is not None:
            user.first_name = data.first_name

        if data.last_name is not None:
            user.last_name = data.last_name

        if data.phone is not None:
            user.phone = data.phone

        if data.email is not None:
            user.email = data.email

        db.commit()
        db.refresh(user)

        return user
