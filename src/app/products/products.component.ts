import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageProduct, Product } from '../model/product.model';
import { AuthentificationService } from '../services/authentification.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products!:Array<Product>;
  currentPage:number=0;
  pageSize:number=5;
  totalPages:number=0;
  errorMessage!:string;
  searchFormGroup! : FormGroup;
  currentAction:string="all";

  
  constructor(private productService : ProductService, private fb: FormBuilder, public authSerivce:AuthentificationService, private router:Router) { }

  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      keyword:this.fb.control(null)
    })
    this.handleGetPageProducts();
    
    
  }

  handleGetPageProducts(){
    /* console.log('yes');
    let arr  = Array.from(new Array(3.6), (x,i) => i+1)

    console.log(arr);
    for(let i = 0; i<arr.length; i++){
      console.log(arr[i]);
    } */
    this.productService.getPageProducts(this.currentPage, this.pageSize).subscribe({
      next:(data:any)=>{
        this.products=data.products;
        this.totalPages=data.totalPages;
        console.log(this.totalPages);
      },
      error: (err)=>{
        this.errorMessage = err;

      }
    });

  }

  handleDeleteProduct(p:any){
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.productService.deleteProduct(p.id).subscribe({
      next:(data:boolean)=>{
        //this.handleGetPageProducts();
        let index = this.products.indexOf(p);
        this.products.splice(index,1);

      }
    })
  }

  handleSetPromotion(p:Product){
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next:(data:boolean)=>{
        p.promotion=!promo;
      },
      error:err=>{
        this.errorMessage=err;

      }
    })

  }

  handleSearchProducts(){
    this.currentAction="search";
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword, this.currentPage, this.pageSize).subscribe({
      next:(data:PageProduct)=>{
        this.products=data.products;
        this.totalPages=data.totalPages;
      }
    })

  }

  goToPage(i:number){
    this.currentPage = i;
    if(this.currentAction=="all"){
      this.handleGetPageProducts();
    }else{
      this.handleSearchProducts();
    }
  }

  handleNewProduct(){
    this.router.navigateByUrl("/admin/newProduct");

  }

  handleEditProduct(p: Product){
    this.router.navigateByUrl("/admin/editProduct/"+p.id);

  }

}
