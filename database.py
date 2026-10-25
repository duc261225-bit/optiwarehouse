"""
OPTIWAREHOUSE DATABASE CONTROLLER (Python + SQLite)
Hỗ trợ quản lý dữ liệu: Khách hàng, Tư vấn, Đơn hàng
"""

import sqlite3
import os
import json
import sys

# Đảm bảo in tiếng Việt trên console Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_FILE = os.path.join(os.path.dirname(__file__), "optiwarehouse.db")
SCHEMA_FILE = os.path.join(os.path.dirname(__file__), "schema.sql")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Khởi tạo CSDL từ file schema.sql nếu chưa tồn tại"""
    conn = get_connection()
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    conn.commit()
    conn.close()
    print("-> Đã khởi tạo cơ sở dữ liệu OptiWarehouse thành công!")

# --- 1. QUẢN LÝ THÔNG TIN TƯ VẤN (CONSULTATIONS) ---
def add_consultation(name, phone, warehouse_size, sales_channel, note=""):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO consultations (full_name, phone, warehouse_size, sales_channel, note, status)
           VALUES (?, ?, ?, ?, ?, 'Mới')""",
        (name, phone, warehouse_size, sales_channel, note)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return new_id

def get_all_consultations():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM consultations ORDER BY created_at DESC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

# --- 2. QUẢN LÝ KHÁCH HÀNG (CUSTOMERS) ---
def add_customer(code, name, phone, email="", shop="", address="", channel="Shopee"):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO customers (customer_code, full_name, phone, email, company_or_shop, address, channel)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (code, name, phone, email, shop, address, channel)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return new_id

def get_all_customers():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM customers ORDER BY id DESC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

# --- 3. QUẢN LÝ ĐƠN HÀNG (ORDERS) ---
def add_order(order_code, customer_id, customer_name, phone, channel, total_amount, racks, items_summary):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO orders (order_code, customer_id, customer_name, customer_phone, channel, total_amount, picking_racks, items_summary)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (order_code, customer_id, customer_name, phone, channel, total_amount, racks, items_summary)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return new_id

def get_all_orders():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

if __name__ == "__main__":
    init_db()
    print("Danh sách tư vấn:", len(get_all_consultations()))
    print("Danh sách khách hàng:", len(get_all_customers()))
    print("Danh sách đơn hàng:", len(get_all_orders()))
