<?php 
    
    //getting products
    function getproducts()
    {
        global $con;

        // condition to check isset or not
        if(!isset($_GET['category']))
        {
            $select_query="select * from products order by rand() limit 0,30";
            $result_query=mysqli_query($con,$select_query);
            while($row=mysqli_fetch_assoc($result_query))
            {
                $product_id=$row['product_id'];
                $product_title=$row['product_title'];
                $product_description=$row['product_description'];
                $product_image1=$row['product_image1'];
                $product_price=$row['product_price'];
                $category_id=$row['category_id'];
                $bestseller=$row['bestseller'];
                // $brand_id=$row['brand_id'];
                if($bestseller=='yes')
                {
                echo "<div class='col-md-3 mb-2'>                                    
                    <div class='card'>     
                        <span class='fw-bold text-light w-50 mb-2 text-center rounded' style='background-color:#008E80'>Bestseller</span>
                        <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                        <div class='card-body'>
                            <h5 class='card-title'>$product_title</h5>
                            <p class='card-text'>$product_description</p>
                            <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                            <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                            <a href='product_details.php?product_id=$product_id' class='btn btn-secondary mb-2' target='_blank'>View more</a>
                        </div>
                    </div>
                </div> ";
                }
            }
        }
    }

    // getting unique categories
    function get_unique_categories()
    {
        global $con;

        // condition to check isset or not
        if(isset($_GET['category']))
        {
            $category_id=$_GET['category'];
            $select_query="select * from products where category_id=$category_id order by rand()";
            $result_query=mysqli_query($con,$select_query);
            $num_of_rows= mysqli_num_rows($result_query);
            if($num_of_rows==0)
            {
                echo "<h2 class='text-center text-danger fs-1 fw-bold mt-5'>No Stock for this category</h2>";
            }

            while($row=mysqli_fetch_assoc($result_query))
            {
                $product_id=$row['product_id'];
                $product_title=$row['product_title'];
                $product_description=$row['product_description'];
                $product_image1=$row['product_image1'];
                $product_price=$row['product_price'];
                $category_id=$row['category_id'];
                $bestseller=$row['bestseller'];
                if($bestseller=='yes')
                {
                // $brand_id=$row['brand_id'];
                echo "<div class='col-md-3 mb-2'>                                    
                    <div class='card'>             
                     <span class='fw-bold text-light w-50 mb-2 text-center rounded' style='background-color:#008E80'>Bestseller</span>
                        <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                        <div class='card-body'>
                            <h5 class='card-title'>$product_title</h5>
                            <p class='card-text'>$product_description</p>
                            <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                            <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                            <a href='product_details.php?product_id=$product_id' class='btn btn-secondary mb-2' target='_blank'>View more</a>
                        </div>
                    </div>
                </div> ";
                }
                else
                {
                    echo "<div class='col-md-3 mb-2'>                                    
                    <div class='card'>                                   
                        <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                        <div class='card-body'>
                            <h5 class='card-title'>$product_title</h5>
                            <p class='card-text'>$product_description</p>
                            <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                            <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                            <a href='product_details.php?product_id=$product_id' class='btn btn-secondary mb-2' target='_blank'>View more</a>
                        </div>
                    </div>
                </div> ";
                }
            }
        }
    }


    //displaying categories in side nav
    function getcategories()
    {
        global $con;
        $select_category="select * from categories";
        $result_category=mysqli_query($con,$select_category);
        while($row_data=mysqli_fetch_assoc($result_category))
            {
                $category_title=$row_data['category_title'];
                $category_id=$row_data['category_id'];
                $category_image=$row_data['category_image'];
                echo "<li class='nav-item px-4 fw-bold d-flex justify-content-between mt-0'>
                        <div>
                            <a href='index.php?category=$category_id' class='nav-link text-dark d-flex justify-content-center align-item-center' style='width:80px; height:80px;'>
                                <img src='admin_area/category_images/$category_image' width=70px height=70px class='p-0 mb-0'>
                            </a>
                            <p class='m-0 p-0 d-flex justify-content-center align-item-center'>
                                <a href='index.php?category=$category_id' class='nav-link text-dark m-auto p-0 d-inline-block m-0'>$category_title</a>
                            </p>
                        </div>
                    </li>";
            }
    }


    // getting all products
    function get_all_products()
    {
        global $con;

        // condition to check isset or not
        if(!isset($_GET['category']))
        {
            $select_query="select * from products order by rand()";
            $result_query=mysqli_query($con,$select_query);
            while($row=mysqli_fetch_assoc($result_query))
            {
                $product_id=$row['product_id'];
                $product_title=$row['product_title'];
                $product_description=$row['product_description'];
                $product_image1=$row['product_image1'];
                $product_price=$row['product_price'];
                $category_id=$row['category_id'];
                $bestseller=$row['bestseller'];
                if($bestseller=='yes')
                {
                // $brand_id=$row['brand_id'];
                echo "<div class='col-md-3 mb-2'>                                    
                    <div class='card'>             
                     <span class='fw-bold text-light w-50 mb-2 text-center rounded' style='background-color:#008E80'>Bestseller</span>
                        <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                        <div class='card-body'>
                            <h5 class='card-title'>$product_title</h5>
                            <p class='card-text'>$product_description</p>
                            <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                            <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                            <a href='product_details.php?product_id=$product_id' class='btn btn-secondary mb-2' target='_blank'>View more</a>
                        </div>
                    </div>
                </div> ";
                }
                else
                {
                    echo "<div class='col-md-3 mb-2'>                                    
                    <div class='card'>                                   
                        <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                        <div class='card-body'>
                            <h5 class='card-title'>$product_title</h5>
                            <p class='card-text'>$product_description</p>
                            <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                            <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                            <a href='product_details.php?product_id=$product_id' class='btn btn-secondary mb-2' target='_blank'>View more</a>
                        </div>
                    </div>
                </div> ";
                }
            }
        }
    }


    // searching products
    function search_products()
    {
        global $con;
        if(isset($_GET['search_data_product']))
        {
            $search_data_value=$_GET['search_data'];
            $search_query="select * from products where product_keywords like '%$search_data_value%'";
            // $select_query="select * from products order by rand() limit 0,7";
            $result_query=mysqli_query($con,$search_query);
            $num_of_rows= mysqli_num_rows($result_query);
            if($num_of_rows==0)
            {
                echo "<h2 class='text-center text-danger fs-1 fw-bold mt-5'>No Result Found</h2>";
            }
            while($row=mysqli_fetch_assoc($result_query))
            {
                $product_id=$row['product_id'];
                $product_title=$row['product_title'];
                $product_description=$row['product_description'];
                $product_image1=$row['product_image1'];
                $product_price=$row['product_price'];
                $category_id=$row['category_id'];
                $bestseller=$row['bestseller'];
                if($bestseller=='yes')
                {
                // $brand_id=$row['brand_id'];
                echo "<div class='col-md-3 mb-2'>                                    
                    <div class='card'>             
                     <span class='fw-bold text-light w-50 mb-2 text-center rounded' style='background-color:#008E80'>Bestseller</span>
                        <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                        <div class='card-body'>
                            <h5 class='card-title'>$product_title</h5>
                            <p class='card-text'>$product_description</p>
                            <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                            <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                            <a href='product_details.php?product_id=$product_id' class='btn btn-secondary mb-2' target='_blank'>View more</a>
                        </div>
                    </div>
                </div> ";
                }
                else
                {
                    echo "<div class='col-md-3 mb-2'>                                    
                    <div class='card'>                                   
                        <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                        <div class='card-body'>
                            <h5 class='card-title'>$product_title</h5>
                            <p class='card-text'>$product_description</p>
                            <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                            <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                            <a href='product_details.php?product_id=$product_id' class='btn btn-secondary mb-2' target='_blank'>View more</a>
                        </div>
                    </div>
                </div> ";
                }
            }
        }
    }


    //view details
    function view_details()
    {
        global $con;

        // condition to check isset or not
        if(isset($_GET['product_id']))
        {
            if(!isset($_GET['category']))
            {
                $product_id=$_GET['product_id'];
                $select_query="select * from products where product_id=$product_id";
                $result_query=mysqli_query($con,$select_query);
                while($row=mysqli_fetch_assoc($result_query))
                {
                    $product_id=$row['product_id'];
                    $product_title=$row['product_title'];
                    $product_description=$row['product_description'];
                    $product_image1=$row['product_image1'];
                    $product_image2=$row['product_image2'];
                    $product_image3=$row['product_image3'];
                    $product_price=$row['product_price'];
                    $category_id=$row['category_id'];
                    $bestseller=$row['bestseller'];
                    if($bestseller=='yes')
                    {
                    // $brand_id=$row['brand_id'];
                    echo "<div class='col-md-5 mb-2'>                                    
                            <div class='card'>
                            <span class='fw-bold text-light w-50 mb-2 text-center rounded' style='background-color:#008E80'>Bestseller</span>
                                <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                                <div class='card-body'>
                                    <h5 class='card-title'>$product_title</h5>
                                    <p class='card-text'>$product_description</p>
                                    <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                                    <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                                    <a href='index.php' class='btn btn-secondary mb-2'>Go Home</a>
                                </div>
                            </div>
                        </div> 
                        <div class='col-md-7'>
                            <!-- related cards -->
                            <div class='row'>
                                <div class='col-md-12'>
                                    <h4 class='text-center text-info mb-5 fs-1 fw-bold'>Related Images</h4>
                                </div>
                                <div class='col-md-6'>                                 
                                    <img src='admin_area/product_images/$product_image2' class='card-img-top' alt='$product_title'>
                                </div>
                                <div class='col-md-6'>                                 
                                    <img src='admin_area/product_images/$product_image3' class='card-img-top' alt='$product_title'>
                                </div>
                            </div>
                        </div>";
                    }
                    else
                    {
                        echo "<div class='col-md-5 mb-2'>                                    
                            <div class='card'>                                   
                                <img src='admin_area/product_images/$product_image1' class='card-img-top' alt='$product_title'>
                                <div class='card-body'>
                                    <h5 class='card-title'>$product_title</h5>
                                    <p class='card-text'>$product_description</p>
                                    <p>Price: <i class='fa fa-inr' aria-hidden='true'></i>$product_price</p>
                                    <a href='index.php?add_to_cart=$product_id' class='btn btn-info mb-2'>Add to cart</a>
                                    <a href='index.php' class='btn btn-secondary mb-2'>Go Home</a>
                                </div>
                            </div>
                        </div> 
                        <div class='col-md-7'>
                            <!-- related cards -->
                            <div class='row'>
                                <div class='col-md-12'>
                                    <h4 class='text-center text-info mb-5 fs-1 fw-bold'>Related Images</h4>
                                </div>
                                <div class='col-md-6'>                                 
                                    <img src='admin_area/product_images/$product_image2' class='card-img-top' alt='$product_title'>
                                </div>
                                <div class='col-md-6'>                                 
                                    <img src='admin_area/product_images/$product_image3' class='card-img-top' alt='$product_title'>
                                </div>
                            </div>
                        </div>";   
                    }
                }
            }
        }
    }


    // get ip function
    function getIPAddress() 
    {  
        //whether ip is from the share internet  
        if(!empty($_SERVER['HTTP_CLIENT_IP'])) 
        {  
            $ip = $_SERVER['HTTP_CLIENT_IP'];  
        }  
        //whether ip is from the proxy  
        elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) 
        {  
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];  
        }  
        //whether ip is from the remote address  
        else
        {  
            $ip = $_SERVER['REMOTE_ADDR'];  
        }  
        return $ip;  
    } 

    

    // cart function
    function cart()
    {
        if(isset($_GET['add_to_cart']))
        {
            global $con;
            if(isset($_SESSION['user_email']))
            {
                $user_id=$_SESSION['user_id'];
                 // $ip = getIPAddress();
                $get_product_id=$_GET['add_to_cart'];
                // $quantity=1;
                $select_query="select * from cart_details where user_id=$user_id and product_id=$get_product_id";
                $result_query=mysqli_query($con,$select_query);
                $num_of_rows=mysqli_num_rows($result_query);
                if($num_of_rows>0)
                {
                    // echo $quantity;
                    // $result=mysqli_fetch_assoc($result_query);
                    // $quantity=$result['quantity'];
                    // $quantity++;
                    // $update="update cart_details set quantity=$quantity where user_id=$user_id and product_id=$get_product_id";
                    // $update_query=mysqli_query($con,$update);
                    echo "<script>alert('Item is already present in cart')</script>";
                    echo "<script>window.open('index.php','_self')</script>";

                }
                else
                {
                    $insert_query="insert into cart_details (product_id,user_id) values($get_product_id,$user_id)";
                    $result_query=mysqli_query($con,$insert_query);
                    echo "<script>alert('Item is added to cart')</script>";
                    echo "<script>window.open('index.php','_self')</script>";
                }
            }
            else
            {
                echo "<script>window.open('users_area/user_login.php','_self')</script>";
            }
        }
    }

    // function to get cart item numbers
    function cart_item()
    {
        if(isset($_SESSION['user_email']))
        {        
            if(isset($_GET['add_to_cart']))
            {
                global $con;
                // $number=0;
                $user_id=$_SESSION['user_id'];
                // $ip = getIPAddress();
                $select_query="select * from cart_details where user_id=$user_id";
                $result_query=mysqli_query($con,$select_query);
                $row_cart_num=mysqli_num_rows($result_query);
                // if($row_cart_num>0)
                // {
                //     // $cart_num=array($row_cart_num['quantity']);
                    // $cart_value=array_sum($cart_num);
                    
            }
            else
            {
                global $con;
                // $number=0;
                $user_id=$_SESSION['user_id'];
                // $ip = getIPAddress();
                $select_query="select * from cart_details where user_id=$user_id";
                $result_query=mysqli_query($con,$select_query);
                $row_cart_num=mysqli_num_rows($result_query);
                // if($row_cart_num)
                // {
                //     $cart_num=array($row_cart_num['quantity']);
                //     $cart_value=array_sum($cart_num);
                //     $number+=$cart_value;
                // }
            }
            echo $row_cart_num;
        }
        else
        {
            echo '0';
        }
}

    // total price
    function total_cart_price()
    {
        if(isset($_SESSION['user_email']))
        {
            global $con;
            $user_id=$_SESSION['user_id'];
            // $ip = getIPAddress();
            $total=0;
            $cart_query="select * from cart_details where user_id=$user_id";  
            $result=mysqli_query($con,$cart_query);
            while($row=mysqli_fetch_array($result))
            {
                $product_id=$row['product_id'];
                // $quantity_number=$row['quantity'];
                $select_product_price="select * from products where product_id=$product_id";
                $result_product_price=mysqli_query($con,$select_product_price);
                while($row_product_price=mysqli_fetch_array($result_product_price))
                {
                    // $product_price=$row_product_price['product_price'];
                    // $total+=$quantity_number*$product_price;
                    $product_price=array($row_product_price['product_price']);
                    $product_value=array_sum($product_price);
                    $total+=$product_value;
                }
            }
            echo $total;
        }
        else
        {
            echo '0';
        }
}



    // Get user order details
    function get_user_order_details()
    {
        global $con;
        $useremail= $_SESSION['user_email'];
        $get_details="Select * from user_table where user_email='$useremail'";
        $result_query=mysqli_query($con,$get_details);
        while($row_query=mysqli_fetch_array($result_query))
        {
            $user_id = $row_query['user_id'];
            if(!isset($_GET['edit_account']))
            {
                if(!isset($_GET['my_orders']))
                {
                    if(!isset($_GET['delete_account']))
                    {
                        $get_orders="Select * from user_orders where user_id=$user_id and order_status='pending'";
                        $result_orders_query=mysqli_query($con,$get_orders);
                        $row_count=mysqli_num_rows($result_orders_query);
                        if($row_count>0)
                        {
                            echo "<h3 class='text-center mt-5 mb-2 fs-1 text-success'>You have <span class='text-danger'>$row_count</span> Pending Orders.</h3>
                            <p class='text-center'><a href='profile.php?my_orders' class='text-dark'>Order Details</a></p>";
                        }
                        else
                        {
                            echo "<h3 class='text-center mt-5 mb-2 fs-1 text-success'>You have Zero Pending Orders.</h3>
                            <p class='text-center'><a href='../index.php' class='text-dark'>Explore Products</a></p>";
                        }
                    }
                }
            }
        }
    }
?>