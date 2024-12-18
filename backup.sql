PGDMP      *                |         	   warehouse    16.3 (Debian 16.3-1.pgdg120+1)    16.3 -    K           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            L           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            M           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            N           1262    24576 	   warehouse    DATABASE     t   CREATE DATABASE warehouse WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE warehouse;
                postgres    false            �            1259    24604    invoice_products    TABLE     ~   CREATE TABLE public.invoice_products (
    invoice_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity bigint
);
 $   DROP TABLE public.invoice_products;
       public         heap    postgres    false            �            1259    24596    invoices    TABLE     `   CREATE TABLE public.invoices (
    id bigint NOT NULL,
    total numeric,
    user_id bigint
);
    DROP TABLE public.invoices;
       public         heap    postgres    false            �            1259    24595    invoices_id_seq    SEQUENCE     x   CREATE SEQUENCE public.invoices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.invoices_id_seq;
       public          postgres    false    220            O           0    0    invoices_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;
          public          postgres    false    219            �            1259    24621    orders    TABLE     �   CREATE TABLE public.orders (
    id bigint NOT NULL,
    product_id bigint,
    quantity bigint,
    status text,
    description text
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    24620    orders_id_seq    SEQUENCE     v   CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public          postgres    false    223            P           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public          postgres    false    222            �            1259    24587    products    TABLE     �   CREATE TABLE public.products (
    id bigint NOT NULL,
    name text,
    quantity bigint,
    price numeric,
    status text,
    is_accepted text,
    storage_location text
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    24586    products_id_seq    SEQUENCE     x   CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.products_id_seq;
       public          postgres    false    218            Q           0    0    products_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
          public          postgres    false    217            �            1259    32820    storages    TABLE     N   CREATE TABLE public.storages (
    capacity bigint,
    id bigint NOT NULL
);
    DROP TABLE public.storages;
       public         heap    postgres    false            �            1259    32823    storages_id_seq    SEQUENCE     x   CREATE SEQUENCE public.storages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.storages_id_seq;
       public          postgres    false    224            R           0    0    storages_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.storages_id_seq OWNED BY public.storages.id;
          public          postgres    false    225            �            1259    24578    users    TABLE     h   CREATE TABLE public.users (
    id bigint NOT NULL,
    login text,
    password text,
    role text
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    24577    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216            S           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            �           2604    24599    invoices id    DEFAULT     j   ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);
 :   ALTER TABLE public.invoices ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �           2604    24624 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    223    223            �           2604    24590    products id    DEFAULT     j   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    32824    storages id    DEFAULT     j   ALTER TABLE ONLY public.storages ALTER COLUMN id SET DEFAULT nextval('public.storages_id_seq'::regclass);
 :   ALTER TABLE public.storages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224            �           2604    24581    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            D          0    24604    invoice_products 
   TABLE DATA           L   COPY public.invoice_products (invoice_id, product_id, quantity) FROM stdin;
    public          postgres    false    221   D/       C          0    24596    invoices 
   TABLE DATA           6   COPY public.invoices (id, total, user_id) FROM stdin;
    public          postgres    false    220   a/       F          0    24621    orders 
   TABLE DATA           O   COPY public.orders (id, product_id, quantity, status, description) FROM stdin;
    public          postgres    false    223   �/       A          0    24587    products 
   TABLE DATA           d   COPY public.products (id, name, quantity, price, status, is_accepted, storage_location) FROM stdin;
    public          postgres    false    218   �/       G          0    32820    storages 
   TABLE DATA           0   COPY public.storages (capacity, id) FROM stdin;
    public          postgres    false    224   T0       ?          0    24578    users 
   TABLE DATA           :   COPY public.users (id, login, password, role) FROM stdin;
    public          postgres    false    216   x0       T           0    0    invoices_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.invoices_id_seq', 29, true);
          public          postgres    false    219            U           0    0    orders_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.orders_id_seq', 9, true);
          public          postgres    false    222            V           0    0    products_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.products_id_seq', 64, true);
          public          postgres    false    217            W           0    0    storages_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.storages_id_seq', 1, true);
          public          postgres    false    225            X           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 7, true);
          public          postgres    false    215            �           2606    24608 &   invoice_products invoice_products_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.invoice_products
    ADD CONSTRAINT invoice_products_pkey PRIMARY KEY (invoice_id, product_id);
 P   ALTER TABLE ONLY public.invoice_products DROP CONSTRAINT invoice_products_pkey;
       public            postgres    false    221    221            �           2606    24603    invoices invoices_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.invoices DROP CONSTRAINT invoices_pkey;
       public            postgres    false    220            �           2606    24628    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    223            �           2606    24594    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    218            �           2606    32813    users uni_users_login 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT uni_users_login UNIQUE (login);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT uni_users_login;
       public            postgres    false    216            �           2606    24585    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           2606    24614 ,   invoice_products fk_invoice_products_invoice    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoice_products
    ADD CONSTRAINT fk_invoice_products_invoice FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);
 V   ALTER TABLE ONLY public.invoice_products DROP CONSTRAINT fk_invoice_products_invoice;
       public          postgres    false    3239    221    220            �           2606    24609 ,   invoice_products fk_invoice_products_product    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoice_products
    ADD CONSTRAINT fk_invoice_products_product FOREIGN KEY (product_id) REFERENCES public.products(id);
 V   ALTER TABLE ONLY public.invoice_products DROP CONSTRAINT fk_invoice_products_product;
       public          postgres    false    3237    218    221            �           2606    24629    orders fk_orders_product    FK CONSTRAINT     }   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES public.products(id);
 B   ALTER TABLE ONLY public.orders DROP CONSTRAINT fk_orders_product;
       public          postgres    false    3237    218    223            D      x������ � �      C   6   x�32���4�22�4�4�2� R@�)��������%�g�ihljnR���� �;,      F      x������ � �      A   �   x���K�@D�5�����x��F���&F>g����[����^�����|Y��3&kO��@��E�\�&F��r�+?�]�[�����(�\��:i��_���?�yc�/+x���;�dW��      G      x�3451�4����� �      ?   �   x�3�LL���3�RFƜ&\�raυ�^�q��b�ņ.6]�w��ˈ�85''��F���*�Բ�¦[/�qs��e&gs�ML9/�GS`Q�͙�YT�hd` T����PՆ�)7�;Y5��9/̺�lȾ�.vڅ�~�$W� ���     