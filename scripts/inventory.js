const popup=document.getElementById('pop-up')
const addNew=document.getElementById('addnew')
const Edit=document.getElementById('edit')
const Submit=document.getElementById('submit')

const closePopup=()=>{
    popup.style.display='none'
    addNew.style.display='block'
}

const openPopup=()=>{
    popup.style.display='flex'
    addNew.style.display='none'
    Submit.style.display='block'
    Edit.style.display='none'
}

const openPopUpEdit=()=>{
    popup.style.display='flex'
    addNew.style.display='none'
    Submit.style.display='none'
    Edit.style.display='block'

}

const loadInventory=()=>{
    $('#table-body').empty();
    const firestore = firebase.firestore();
    firestore
        .collection('inventory')
        .get().then((result)=>{
            result.forEach((records)=>{
                const data = records.data();
                const row=`
                <tr>
                    <th>${records.id}</th>
                    <td>${data.name}</td>
                    <td>${data.quantity}</td>
                    <td>${data.price}</td>
                    <td>${data.expirationDate}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteData('${records.id}')">Delete</button> |
                        <button class="btn btn-success btn-sm" onclick="updateData('${records.id}')">Update</button>
                    </td>
                </tr>
                `;
                $('#table-body').append(row);
            });
    });
}

createInventory=()=>{
    if($('#price').val()>0 |$('#quantity').val()>0){
    const tempInventory={
        name:$('#name').val(), 
        quantity:$('#quantity').val(),
        price:$('#price').val(),
        expirationDate:$('#expirationDate').val()
    };
    const database=firebase.firestore();
    database
    .collection("inventory")
    .add(tempInventory)
    .then((response)=>{
        closePopup();
        toastr.options.closeMethod = 'fadeOut';
        toastr.options.closeDuration = 300;
        toastr.options.closeEasing = 'swing';
        toastr.success('Added!', 'Success!')
        loadInventory();
    })
    .catch((error)=>{
        alert("Error")
        console.log(error);
    })
    }else{
        alert("Invalid input")
    }
}

inventoryId=undefined;
const updateData=(id)=>{
    inventoryId=id;
    const firestore = firebase.firestore();
    firestore
        .collection('inventory')
        .doc(inventoryId)
        .get().then((response)=>{
            if (response.exists) {
                const data = response.data();
                $('#name').val(data.name), 
                $('#quantity').val(data.quantity),
                $('#price').val(data.price)
                $('#expirationDate').val(data.expirationDate)
                openPopUpEdit();
            }
    })
}

const updateRecord=()=>{
    if (inventoryId){
        const firestore = firebase.firestore();
        firestore
            .collection('inventory')
            .doc(inventoryId)
            .update({
                name:$('#name').val(), 
                quantity:$('#quantity').val(),
        price:$('#price').val(),
        expirationDate:$('#expirationDate').val()
            }).then(()=>{
            inventoryId=undefined;
            closePopup();
            toastr.options.closeMethod = 'fadeOut';
            toastr.options.closeDuration = 300;
            toastr.options.closeEasing = 'swing';
            toastr.success('Edit!', 'Success!')
            loadInventory();
            
        })
    }
}

const deleteData=(id)=>{
    if (confirm('Are you sure?')){
        const firestore = firebase.firestore();
        firestore
            .collection('inventory')
            .doc(id)
            .delete()
            .then(()=>{

                toastr.options.closeMethod = 'fadeOut';
                toastr.options.closeDuration = 300;
                toastr.options.closeEasing = 'swing';
                toastr.success('Deleted!', 'Success!')
                inventoryId=undefined;
                loadInventory();
            })
    }
}