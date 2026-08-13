"""숙박 예약 스키마 베이스라인.

영화 예매 도메인에서 넘어오면서 이전 리비전 18개는 모두 무효가 됐다.
테이블 이름과 컬럼 의미가 전부 바뀌어 순차 적용이 성립하지 않기 때문에,
이력을 이어 붙이지 않고 하나의 베이스라인으로 접었다.

Revision ID: 0001_lodging_baseline
Revises:
"""
from alembic import op

revision = "0001_lodging_baseline"
down_revision = None
branch_labels = None
depends_on = None


DDL = [
    """CREATE TYPE roleenum AS ENUM ('USER', 'ADMIN')""",
    """CREATE TYPE termtypeenum AS ENUM ('SERVICE', 'PRIVACY', 'MARKETING')""",
    """CREATE TYPE propertytypeenum AS ENUM ('APARTMENT', 'HOTEL', 'GUESTHOUSE', 'PENSION', 'HOUSE')""",
    """CREATE TYPE propertystatusenum AS ENUM ('LISTED', 'COMING_SOON', 'DELISTED')""",
    """CREATE TYPE roomgradeenum AS ENUM ('STANDARD', 'DELUXE', 'ACCESSIBLE')""",
    """CREATE TYPE daytypeenum AS ENUM ('WEEKDAY', 'WEEKEND')""",
    """CREATE TYPE seasonenum AS ENUM ('OFF', 'SHOULDER', 'PEAK', 'HOLIDAY')""",
    """CREATE TYPE bookingstatusenum AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED')""",
    """CREATE TYPE voucherstatusenum AS ENUM ('ISSUED', 'USED', 'CANCELLED')""",
    """CREATE TYPE paymentmethodenum AS ENUM ('CARD', 'KAKAOPAY', 'NAVERPAY')""",
    """CREATE TYPE paymentstatusenum AS ENUM ('PENDING', 'SUCCESS', 'FAILED')""",
    """CREATE TYPE refundstatusenum AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED')""",
    """CREATE TYPE receipttypeenum AS ENUM ('CASH', 'TAX', 'GENERAL')""",
    """CREATE TYPE notificationtypeenum AS ENUM ('BOOKING_CONFIRMED', 'REFUND_COMPLETED', 'CHECKIN_REMINDER', 'MARKETING')""",
    """CREATE TABLE user_status_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE user_role_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE booking_status_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE payment_status_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE payment_method_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE room_status_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE room_grade_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE bed_type_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE coupon_status_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE coupon_type_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE property_status_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE property_type_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE voucher_status_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE review_status_codes (
	code VARCHAR(30) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (code)
)""",
    """CREATE TABLE terms (
	id UUID NOT NULL, 
	type termtypeenum NOT NULL, 
	version INTEGER NOT NULL, 
	content TEXT NOT NULL, 
	required BOOLEAN NOT NULL, 
	effective_from TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id)
)""",
    """CREATE TABLE properties (
	id UUID NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	name_en VARCHAR(255), 
	description TEXT NOT NULL, 
	host_name VARCHAR(100) NOT NULL, 
	highlights TEXT NOT NULL, 
	max_guests INTEGER NOT NULL, 
	property_type propertytypeenum NOT NULL, 
	photo_url VARCHAR(512), 
	listed_at TIMESTAMP WITHOUT TIME ZONE, 
	status propertystatusenum NOT NULL, 
	delisted_at TIMESTAMP WITHOUT TIME ZONE, 
	brand VARCHAR(100), 
	total_bookings INTEGER, 
	booking_rank INTEGER, 
	avg_rating NUMERIC(3, 2), 
	review_count INTEGER, 
	region VARCHAR(50) NOT NULL, 
	address VARCHAR(255) NOT NULL, 
	phone VARCHAR(20) NOT NULL, 
	latitude NUMERIC(10, 7), 
	longitude NUMERIC(10, 7), 
	parking_available BOOLEAN, 
	parking_count INTEGER, 
	PRIMARY KEY (id)
)""",
    """CREATE INDEX ix_properties_region ON properties (region)""",
    """CREATE TABLE guest_types (
	id UUID NOT NULL, 
	code VARCHAR(20) NOT NULL, 
	name VARCHAR(50) NOT NULL, 
	discount_amount INTEGER NOT NULL, 
	description TEXT, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (code)
)""",
    """CREATE TABLE rate_plans (
	id UUID NOT NULL, 
	day_type daytypeenum NOT NULL, 
	season seasonenum NOT NULL, 
	room_grade roomgradeenum NOT NULL, 
	price INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_rate_plan UNIQUE (day_type, season, room_grade)
)""",
    """CREATE TABLE board_types (
	id UUID NOT NULL, 
	code VARCHAR(20) NOT NULL, 
	name VARCHAR(50) NOT NULL, 
	extra_charge INTEGER NOT NULL, 
	description TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (code)
)""",
    """CREATE TABLE peak_dates (
	id UUID NOT NULL, 
	date DATE NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	extra_charge INTEGER NOT NULL, 
	description TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (date)
)""",
    """CREATE TABLE amenities (
	id UUID NOT NULL, 
	name VARCHAR(50) NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (name)
)""",
    """CREATE TABLE addon_categories (
	id UUID NOT NULL, 
	name VARCHAR(50) NOT NULL, 
	display_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (id)
)""",
    """CREATE TABLE partners (
	id UUID NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	code VARCHAR(30) NOT NULL, 
	description TEXT, 
	logo_url VARCHAR(512), 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (code)
)""",
    """CREATE TABLE discount_combination_rules (
	id UUID NOT NULL, 
	discount_a VARCHAR(30) NOT NULL, 
	discount_b VARCHAR(30) NOT NULL, 
	is_stackable BOOLEAN NOT NULL, 
	description TEXT, 
	PRIMARY KEY (id)
)""",
    """CREATE TABLE users (
	id UUID NOT NULL, 
	email VARCHAR(255), 
	hashed_password VARCHAR(255), 
	name VARCHAR(100) NOT NULL, 
	phone VARCHAR(20), 
	role roleenum NOT NULL, 
	is_guest BOOLEAN NOT NULL, 
	guest_expires_at TIMESTAMP WITHOUT TIME ZONE, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	status_code VARCHAR(30), 
	point_balance INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(status_code) REFERENCES user_status_codes (code)
)""",
    """CREATE INDEX ix_users_is_guest ON users (is_guest)""",
    """CREATE UNIQUE INDEX ix_users_email ON users (email)""",
    """CREATE TABLE room_types (
	id UUID NOT NULL, 
	property_id UUID NOT NULL, 
	name VARCHAR(50) NOT NULL, 
	total_rooms INTEGER NOT NULL, 
	bed_type_code VARCHAR(30), 
	location_detail VARCHAR(100), 
	standard_room_count INTEGER, 
	deluxe_room_count INTEGER, 
	accessible_room_count INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(property_id) REFERENCES properties (id), 
	FOREIGN KEY(bed_type_code) REFERENCES bed_type_codes (code)
)""",
    """CREATE TABLE property_board_types (
	property_id UUID NOT NULL, 
	board_type_id UUID NOT NULL, 
	PRIMARY KEY (property_id, board_type_id), 
	FOREIGN KEY(property_id) REFERENCES properties (id), 
	FOREIGN KEY(board_type_id) REFERENCES board_types (id)
)""",
    """CREATE TABLE property_amenities (
	property_id UUID NOT NULL, 
	amenity_id UUID NOT NULL, 
	PRIMARY KEY (property_id, amenity_id), 
	FOREIGN KEY(property_id) REFERENCES properties (id), 
	FOREIGN KEY(amenity_id) REFERENCES amenities (id)
)""",
    """CREATE TABLE coupon_masters (
	id UUID NOT NULL, 
	code VARCHAR(50) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	type_code VARCHAR(30) NOT NULL, 
	discount_value INTEGER NOT NULL, 
	min_booking_amount INTEGER NOT NULL, 
	max_discount_amount INTEGER, 
	valid_from TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	valid_to TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	max_issues INTEGER, 
	issued_count INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (code), 
	FOREIGN KEY(type_code) REFERENCES coupon_type_codes (code)
)""",
    """CREATE TABLE addon_items (
	id UUID NOT NULL, 
	category_id UUID NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	price INTEGER NOT NULL, 
	description TEXT, 
	image_url VARCHAR(512), 
	is_available BOOLEAN NOT NULL, 
	display_order INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(category_id) REFERENCES addon_categories (id)
)""",
    """CREATE TABLE membership_products (
	id UUID NOT NULL, 
	partner_id UUID NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	discount_type VARCHAR(20) NOT NULL, 
	discount_value INTEGER NOT NULL, 
	monthly_price INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(partner_id) REFERENCES partners (id)
)""",
    """CREATE TABLE identity_verifications (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	verified_at TIMESTAMP WITHOUT TIME ZONE, 
	expires_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)""",
    """CREATE TABLE term_agreements (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	term_id UUID NOT NULL, 
	agreed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_user_term UNIQUE (user_id, term_id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(term_id) REFERENCES terms (id)
)""",
    """CREATE TABLE rooms (
	id UUID NOT NULL, 
	room_type_id UUID NOT NULL, 
	floor VARCHAR(3) NOT NULL, 
	number INTEGER NOT NULL, 
	room_grade roomgradeenum NOT NULL, 
	status_code VARCHAR(30), 
	PRIMARY KEY (id), 
	CONSTRAINT uq_room_type_room UNIQUE (room_type_id, floor, number), 
	FOREIGN KEY(room_type_id) REFERENCES room_types (id), 
	FOREIGN KEY(status_code) REFERENCES room_status_codes (code)
)""",
    """CREATE TABLE stay_dates (
	id UUID NOT NULL, 
	property_id UUID NOT NULL, 
	room_type_id UUID NOT NULL, 
	board_type_id UUID, 
	check_in TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	check_out TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	stay_date TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	nights INTEGER, 
	booked_rooms INTEGER, 
	occupancy_rate NUMERIC(5, 2), 
	PRIMARY KEY (id), 
	FOREIGN KEY(property_id) REFERENCES properties (id), 
	FOREIGN KEY(room_type_id) REFERENCES room_types (id), 
	FOREIGN KEY(board_type_id) REFERENCES board_types (id)
)""",
    """CREATE INDEX ix_stay_dates_stay_date ON stay_dates (stay_date)""",
    """CREATE INDEX idx_property_date ON stay_dates (property_id, stay_date)""",
    """CREATE INDEX idx_room_type_checkin ON stay_dates (room_type_id, check_in)""",
    """CREATE TABLE wishlists (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	property_id UUID NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_user_property_wishlist UNIQUE (user_id, property_id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(property_id) REFERENCES properties (id)
)""",
    """CREATE TABLE user_coupons (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	coupon_master_id UUID NOT NULL, 
	status_code VARCHAR(30) NOT NULL, 
	issued_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	used_at TIMESTAMP WITHOUT TIME ZONE, 
	expires_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(coupon_master_id) REFERENCES coupon_masters (id), 
	FOREIGN KEY(status_code) REFERENCES coupon_status_codes (code)
)""",
    """CREATE TABLE addon_options (
	id UUID NOT NULL, 
	item_id UUID NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	price INTEGER NOT NULL, 
	is_available BOOLEAN NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(item_id) REFERENCES addon_items (id)
)""",
    """CREATE TABLE memberships (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	product_id UUID NOT NULL, 
	status VARCHAR(20) NOT NULL, 
	started_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	expires_at TIMESTAMP WITHOUT TIME ZONE, 
	cancelled_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_user_membership UNIQUE (user_id, product_id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(product_id) REFERENCES membership_products (id)
)""",
    """CREATE TABLE notification_settings (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	email_enabled BOOLEAN NOT NULL, 
	sms_enabled BOOLEAN NOT NULL, 
	push_enabled BOOLEAN NOT NULL, 
	booking_notification BOOLEAN NOT NULL, 
	refund_notification BOOLEAN NOT NULL, 
	marketing_notification BOOLEAN NOT NULL, 
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)""",
    """CREATE TABLE user_activities (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	type VARCHAR(50) NOT NULL, 
	description VARCHAR(300), 
	ip_address VARCHAR(45), 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)""",
    """CREATE TABLE admin_audit_logs (
	id UUID NOT NULL, 
	admin_id UUID NOT NULL, 
	action VARCHAR(50) NOT NULL, 
	resource_type VARCHAR(50) NOT NULL, 
	resource_id VARCHAR(100), 
	before_data JSON, 
	after_data JSON, 
	ip_address VARCHAR(45), 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(admin_id) REFERENCES users (id)
)""",
    """CREATE TABLE room_holds (
	id UUID NOT NULL, 
	stay_date_id UUID NOT NULL, 
	room_id UUID NOT NULL, 
	user_id UUID, 
	session_id VARCHAR(255), 
	held_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_stay_date_room UNIQUE (stay_date_id, room_id), 
	FOREIGN KEY(stay_date_id) REFERENCES stay_dates (id), 
	FOREIGN KEY(room_id) REFERENCES rooms (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)""",
    """CREATE INDEX ix_room_holds_expires_at ON room_holds (expires_at)""",
    """CREATE TABLE bookings (
	id UUID NOT NULL, 
	booking_number VARCHAR(36) NOT NULL, 
	user_id UUID NOT NULL, 
	stay_date_id UUID NOT NULL, 
	total_price INTEGER NOT NULL, 
	status bookingstatusenum NOT NULL, 
	booked_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	guest_breakdown JSON, 
	coupon_discount INTEGER, 
	points_used INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(stay_date_id) REFERENCES stay_dates (id)
)""",
    """CREATE UNIQUE INDEX ix_bookings_booking_number ON bookings (booking_number)""",
    """CREATE TABLE booking_rooms (
	id UUID NOT NULL, 
	booking_id UUID NOT NULL, 
	room_id UUID NOT NULL, 
	price INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_booking_room UNIQUE (booking_id, room_id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id), 
	FOREIGN KEY(room_id) REFERENCES rooms (id)
)""",
    """CREATE TABLE payments (
	id UUID NOT NULL, 
	booking_id UUID NOT NULL, 
	payment_method paymentmethodenum NOT NULL, 
	amount INTEGER NOT NULL, 
	status paymentstatusenum NOT NULL, 
	approval_number VARCHAR(100), 
	approved_at TIMESTAMP WITHOUT TIME ZONE, 
	pg_transaction_id VARCHAR(100), 
	method_code VARCHAR(30), 
	status_code VARCHAR(30), 
	PRIMARY KEY (id), 
	UNIQUE (booking_id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id), 
	FOREIGN KEY(method_code) REFERENCES payment_method_codes (code), 
	FOREIGN KEY(status_code) REFERENCES payment_status_codes (code)
)""",
    """CREATE TABLE refunds (
	id UUID NOT NULL, 
	booking_id UUID NOT NULL, 
	refund_amount INTEGER NOT NULL, 
	reason TEXT, 
	status refundstatusenum NOT NULL, 
	requested_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	processed_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	UNIQUE (booking_id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id)
)""",
    """CREATE TABLE receipts (
	id UUID NOT NULL, 
	booking_id UUID NOT NULL, 
	receipt_number VARCHAR(50) NOT NULL, 
	receipt_type receipttypeenum NOT NULL, 
	issued_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	total_amount INTEGER NOT NULL, 
	tax_amount INTEGER NOT NULL, 
	issuer_name VARCHAR(100), 
	issuer_registration_number VARCHAR(20), 
	PRIMARY KEY (id), 
	UNIQUE (booking_id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id), 
	UNIQUE (receipt_number)
)""",
    """CREATE TABLE notifications (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	type notificationtypeenum NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	body TEXT, 
	is_read BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	related_booking_id UUID, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(related_booking_id) REFERENCES bookings (id)
)""",
    """CREATE TABLE room_change_histories (
	id UUID NOT NULL, 
	booking_id UUID NOT NULL, 
	old_room_ids JSON NOT NULL, 
	new_room_ids JSON NOT NULL, 
	changed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	reason TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id)
)""",
    """CREATE TABLE coupon_usages (
	id UUID NOT NULL, 
	user_coupon_id UUID NOT NULL, 
	booking_id UUID NOT NULL, 
	discount_amount INTEGER NOT NULL, 
	used_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_coupon_id) REFERENCES user_coupons (id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id)
)""",
    """CREATE TABLE point_histories (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	type VARCHAR(20) NOT NULL, 
	amount INTEGER NOT NULL, 
	balance_after INTEGER NOT NULL, 
	booking_id UUID, 
	description VARCHAR(200), 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id)
)""",
    """CREATE TABLE booking_addons (
	id UUID NOT NULL, 
	booking_id UUID NOT NULL, 
	item_id UUID NOT NULL, 
	option_id UUID, 
	quantity INTEGER NOT NULL, 
	unit_price INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id), 
	FOREIGN KEY(item_id) REFERENCES addon_items (id), 
	FOREIGN KEY(option_id) REFERENCES addon_options (id)
)""",
    """CREATE TABLE reviews (
	id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	property_id UUID NOT NULL, 
	booking_id UUID, 
	rating INTEGER NOT NULL, 
	content TEXT, 
	status_code VARCHAR(30) NOT NULL, 
	is_spoiler BOOLEAN NOT NULL, 
	helpful_count INTEGER NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_user_property_review UNIQUE (user_id, property_id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(property_id) REFERENCES properties (id), 
	FOREIGN KEY(booking_id) REFERENCES bookings (id), 
	FOREIGN KEY(status_code) REFERENCES review_status_codes (code)
)""",
    """CREATE TABLE stay_vouchers (
	id UUID NOT NULL, 
	booking_room_id UUID NOT NULL, 
	qr_code VARCHAR(36) NOT NULL, 
	status voucherstatusenum NOT NULL, 
	issued_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	used_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	UNIQUE (booking_room_id), 
	FOREIGN KEY(booking_room_id) REFERENCES booking_rooms (id), 
	UNIQUE (qr_code)
)""",
    """CREATE TABLE review_helpfuls (
	review_id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (review_id, user_id), 
	FOREIGN KEY(review_id) REFERENCES reviews (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)""",
    """CREATE TABLE review_reports (
	id UUID NOT NULL, 
	review_id UUID NOT NULL, 
	user_id UUID NOT NULL, 
	reason VARCHAR(200), 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_review_report UNIQUE (review_id, user_id), 
	FOREIGN KEY(review_id) REFERENCES reviews (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)""",
]

TABLES = ['addon_categories', 'amenities', 'bed_type_codes', 'board_types', 'booking_status_codes', 'coupon_status_codes', 'coupon_type_codes', 'discount_combination_rules', 'guest_types', 'partners', 'payment_method_codes', 'payment_status_codes', 'peak_dates', 'properties', 'property_status_codes', 'property_type_codes', 'rate_plans', 'review_status_codes', 'room_grade_codes', 'room_status_codes', 'terms', 'user_role_codes', 'user_status_codes', 'voucher_status_codes', 'addon_items', 'coupon_masters', 'membership_products', 'property_amenities', 'property_board_types', 'room_types', 'users', 'addon_options', 'admin_audit_logs', 'identity_verifications', 'memberships', 'notification_settings', 'rooms', 'stay_dates', 'term_agreements', 'user_activities', 'user_coupons', 'wishlists', 'bookings', 'room_holds', 'booking_addons', 'booking_rooms', 'coupon_usages', 'notifications', 'payments', 'point_histories', 'receipts', 'refunds', 'reviews', 'room_change_histories', 'review_helpfuls', 'review_reports', 'stay_vouchers']

ENUMS = ['bookingstatusenum', 'daytypeenum', 'notificationtypeenum', 'paymentmethodenum', 'paymentstatusenum', 'propertystatusenum', 'propertytypeenum', 'receipttypeenum', 'refundstatusenum', 'roleenum', 'roomgradeenum', 'seasonenum', 'termtypeenum', 'voucherstatusenum']


def upgrade() -> None:
    for stmt in DDL:
        op.execute(stmt)


def downgrade() -> None:
    for name in reversed(TABLES):
        op.execute(f'DROP TABLE IF EXISTS "{name}" CASCADE')
    for name in ENUMS:
        op.execute(f'DROP TYPE IF EXISTS "{name}"')
