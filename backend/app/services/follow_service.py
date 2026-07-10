from fastapi import HTTPException

from app.models.follow import Follow
from app.models.seller import SellerProfile


class FollowService:

    @staticmethod
    def follow_seller(data, current_user, db):

        seller = (
            db.query(SellerProfile).filter(SellerProfile.id == data.seller_id).first()
        )

        if not seller:
            raise HTTPException(status_code=404, detail="Seller not found")

        if seller.user_id == current_user.id:
            raise HTTPException(
                status_code=400, detail="You cannot follow your own shop."
            )

        existing = (
            db.query(Follow)
            .filter(
                Follow.buyer_id == current_user.id,
                Follow.seller_id == data.seller_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400, detail="You are already following this seller"
            )

        follow = Follow(
            buyer_id=current_user.id,
            seller_id=data.seller_id,
        )
        db.add(follow)
        db.commit()
        db.refresh(follow)
        return follow

    @staticmethod
    def get_my_following(current_user, db):
        """
        Get the list of sellers that the current user is following.
        """
        return db.query(Follow).filter(Follow.buyer_id == current_user.id).all()

    @staticmethod
    def unfollow_seller(seller_id, current_user, db):
        follow = (
            db.query(Follow)
            .filter(
                Follow.buyer_id == current_user.id,
                Follow.seller_id == seller_id,
            )
            .first()
        )

        if not follow:
            raise HTTPException(
                status_code=404, detail="You are not following this seller"
            )

        db.delete(follow)
        db.commit()
        return {"detail": "Successfully unfollowed the seller"}

    @staticmethod
    def get_seller_followers(seller_id, db):
        return db.query(Follow).filter(Follow.seller_id == seller_id).all()
