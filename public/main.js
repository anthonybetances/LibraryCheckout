var avail = document.getElementsByClassName("available")
let remove = document.getElementsByClassName("fas fa-times")

Array.from(avail).forEach(function(element) {
      element.addEventListener('click', function(){
        alert("click's working")
        const title = this.parentNode.childNodes[1].innerText
        // console.log(title)
        const author = this.parentNode.childNodes[3].innerText
        // console.log(author)
        const available = this.parentNode.childNodes[5].innerText
        // console.log(available)
        fetch('inventoryUpdate', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'title': title,
            'author': author,
            'available':available
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});



Array.from(remove).forEach(function(element) {
      element.addEventListener('click', function(){
        alert("click's working")
        const title = this.parentNode.parentNode.childNodes[1].innerText
        const author = this.parentNode.parentNode.childNodes[3].innerText

        fetch('inventoryUpdate2', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'title': title,
            'author': author,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
