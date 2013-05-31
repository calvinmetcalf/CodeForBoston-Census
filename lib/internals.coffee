exports.run=(app)->
    ipaddr = process.env.OPENSHIFT_INTERNAL_IP or process.env.IP or '0.0.0.0'
    port = process.env.OPENSHIFT_INTERNAL_PORT or process.env.PORT or 7027 
    console.warn "No OPENSHIFT_INTERNAL_IP environment variable"  if typeof ipaddr is "undefined"
    terminator = (sig) ->
        if typeof sig is "string"
            console.log "%s: Received %s - terminating Node server ...", Date(Date.now()), sig
            process.exit 1
        console.log "%s: Node server stopped.", Date(Date.now())
        return true
    process.on "exit", ->
        terminator()
        return true
    [ "SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT", "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGPIPE", "SIGTERM" ].forEach (element, index, array) ->
        process.on element, ->
            terminator element
            return true
        return true
    app.listen port, ipaddr, ->
        console.log "%s: Node server started on %s:%d ...", Date(Date.now()), ipaddr, port
        return true