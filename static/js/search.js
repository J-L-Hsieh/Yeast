$.ajaxSetup({
    headers: { 'X-CSRFToken': csrf_token },
    type: 'POST',
});
$(document).ready(function() {

    $('#submit').click(function(){
        var input = $('#search_input').serialize();
        console.log(input)
        $.ajax({
            url: 'ajax_search/',
            data: $('#search_input').serialize(),
            success: function(response){
                let feature = response.feature
                $('#search_result').show()
                $('#result').html(`<div class="card"><div class="card-body"> ${response.table}</div></div>`);
                // /*--------add column------*/
                // let trs = document.querySelectorAll('#result_table tr');

                // for (let tr of trs) {
                //     let td = document.createElement('td');
                //     tr.appendChild(td);
                // }
                // /*--------add column------*/

                $('#result_table').DataTable({
                    'bAutoWidth':true,
                    'scrollX':true,
                    'scrollY':true,
                    'columnDefs':[
                        {   'targets': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            render:function(data,type,row,meta){
                                if (data == '-'){
                                    return `<a> ${data} </a>`;
                                }else{
                                    data = eval(data)
                                    if (data.length > 3){
                                        hide_data = data.slice(2)
                                        return `<a > ${data[0]}, ${data[1]}, ${data[2]}</a><br>
                                                <i data-bs-toggle="collapse" href="#detail${meta.col}_${meta.row}" style="color:darkblue" class="fa fa-bars" aria-hidden="true"></i>
                                                <div class="collapse" id="detail${meta.col}_${meta.row}">
                                                    ${hide_data}
                                                </div>`
                                    }else{
                                        return `<a> ${data} </a>`;
                                    }
                                }
                            },
                        },
                        {   'targets':-1,
                            render:function(data,type,row,meta){
                                 return '<a href = "/yeast/browse/associated/?id='+ data + '&name='+ row[0] +'&feature='+ feature +'"> Detail </a>';
                            },
                        },
                    ]
                });
            },

            error: function(){
                alert('Something error');
            },
        })
    })
})
