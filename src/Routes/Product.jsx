import "../css/Product.css"
import axios from 'axios'
import {Link} from "react-router-dom"
import { useEffect,useState } from 'react'
import Navbar from './Navbar'
import Footer from "../Components/Footer"
import Pagination from "../Components/Pagination"
import { Box ,Text,Grid,Card,CardBody,Image,Stack,Skeleton,Heading,Divider,CardFooter,ButtonGroup,Button} from "@chakra-ui/react";
// import { Grid, GridItem } from "@chakra-ui/react";

import Cart from "../Components/Cart"

// import Pagination from "../Components/Pagination"

function Product() {
  const [data, setData] = useState([]);
  const [filterByColors, setFilterByColors] = useState([]);
  const [order, setOrder] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartItems3, setCartItems3] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [page,setPage]= useState(6)
  // const [totalPages,setTotalPages] = useState(36)
const totalPages=6
  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:8080/products`, {
      params: {
        _page: page,
        _limit: 6,
        _sort: "price",
        _order: order
      }
    })
      .then((res) => res.data)
      .then(data => {
        let filteredData = data;
        if (filterByColors.length > 0) {
          filteredData = data.filter(data => filterByColors.includes(data.category));
        }
        setData(filteredData);
      })
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  }, [page,order,filterByColors]);

  const handleColorChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setFilterByColors(prev => [...prev, value]);
    } else {
      setFilterByColors(prev => prev.filter(category => category !== value));
    }
  }

  const handleCartfun = (id) => {
    return axios.get(`http://localhost:8080/products/${id}`);
  };

  const addToCart = (ele) => {
    handleCartfun(ele.id)
      .then((res) => {
        setCartItems(res.data);
        return axios.post("http://localhost:8080/cart", res.data);
      })
      .then(() => {
        alert("Product Added Successfully");
        getData();
      })
      .catch((err) => console.log(err));
  };

  const getData = () => {
    setIsLoading(true);
    axios.get(`http://localhost:8080/cart`)
      .then((res) => setCartItems3(res.data))
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  };
if(isLoading){
  return <>
  <Navbar />
  <Stack data-cy="loading_indicator">
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
</Stack>
</>
}


  const pageCount = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedData = data.slice(startIndex, startIndex + pageSize);
// const addToCart = (ele) => {
//   // console.log(ele)
//   handleCartfun(ele.id) .then((res)=> setCartItems2(res.data))

//   async function handlePostData(){    
//   try {
//     let res= await fetch("http://localhost:8080/cart",{
//        method:"POST",
//            headers:{
//              'Content-Type' : 'application/json'
//            },
//            body:JSON.stringify(cartItems2)
//     });
  
//     alert("Product Added Successfuly")
//     // console.log(res)
//   } catch (error) {
//     console.log(error)
//   }
//  }

//  handlePostData();
// getData()
//  }
 
const handlePageChange =(page)=>{
  setPage(page)
}
 
  return (
    <>

    <Navbar/>

    {/* ---------------sort---by-----price------------------- */}
    
    <div className="all-product">
    <div className="side-bar" style={{padding:"20px"}}>
    <label>
        Sort by Price:
        <select value={order} onChange={(event) => setOrder(event.target.value)}>
          <option value="">Select by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </label>
      {/*   plant  */}
      <br/>
      <Divider />
  <div style={{marginTop:"40px"}}>
    <label >
        Filter by Category
        <br />
        <input type="checkbox" id="Ayurvedic" name="Ayurvedic" value="plant" checked={filterByColors.includes("plant")} onChange={handleColorChange} />
        <label htmlFor="plant">plant</label>
        <br />

        <input type="checkbox" id="Suppliment" name="Suppliment" value="fertilizer" checked={filterByColors.includes("fertilizer")} onChange={handleColorChange} />
        <label htmlFor="fertilizer">fertilizer</label>
        <br />
        <input type="checkbox" id="Diabetes Care" name="Diabetes Care" value="seeds" checked={filterByColors.includes("seeds")} onChange={handleColorChange} />
        <label htmlFor="seeds">seeds</label>
        <br />
        
        <br />


        
      </label>
      </div>


    </div>
    {/* ----------------------------------------------------------------------------------------------------- */}
    <div className="makeit">
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
  {data?.map((ele) => (
    <Card key={ele.id} maxW='xs'>
      <CardBody>
        <Image
          src={ele.image}
          alt={ele.name}
          borderRadius='lg'
        />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{ele.name}</Heading>

          <Text color='green.600' fontSize='1xl'>
         {ele.mkt}
          </Text>
          <Text color='green.600' fontSize='1.5xl'>
          Category - {ele.category}
          </Text>

          <Text color='blue.600' fontSize='2xl'>
         Price - ₹{ele.price}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing='2'>

          <Button variant='ghost' colorScheme='blue' onClick={() => addToCart(ele)}>
            Add to cart
          </Button>
          <Link to={`/product/${ele.id}`}> <Button >More Info</Button></Link>
          {/* <Link to={`/product/${ele.id}`}>More Info</Link> */}
        </ButtonGroup>
      </CardFooter>
    </Card>
  ))}
</Grid>
</div>
    


</div >
<div  style={{marginLeft:"500px",
marginTop:"30px",
marginBottom:"30px",
}}>
{data.length>0 && <Pagination totalPages={totalPages} handlePageChange={handlePageChange} currentPage={page}/>}
</div> 
{/* <div >
    <button disabled={page===1} onClick={()=>setPage(page-1)} >PREV</button>
    <button disabled>{page}</button>
    <button disabled={page===6} onClick={()=>setPage(page+1)}>NEXT</button>
    </div> */}

    <Footer/>
</>
  )
          
}


export default Product;