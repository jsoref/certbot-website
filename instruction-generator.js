// JSON blobs:
// input -- generated by the web UI
// strings -- a table of [translatable, reusable] strings that can be edited separately from this JS

input_map = {
    "Debian 7 (wheezy)" : {
         os: "debian",
         os_version: 7,
     },
     "Debian 8 (jessie)" : {
         os: "debian",
         os_version: 7,
     },
    "Debian testing/unstable" : {
         os: "debian",
         os_version: 9,
    },
    "Debian (other)" : {
        os: "debian",
        os_version: 0,
    }
}
out = "";

iprint = function(s, dict={}) {
    dict.cmd = command;
    out = out + Mustache.render(s, dict);
    return out;
}

command = strings.cb_cmd;  // default, but can be changed by print_cbauto_instructions


print_help = function() {
    print_install_instructions()
    print_getting_started_instructions()
}

print_install_instructions = function() {
    if (input.usecase == "developer") {
        return strings.dev_install;
    }
    if (input.os == "debian" or input.os == "ubuntu") {
        return print_debian_install_instructions()
    }
    if (input.os = "python"){
        return print_pip_install_instructions()
    }
    print_cbauto_instructions()
}

print_debian_install_instructions = function() {
    backport = "";
    if (input.os_version == "debian" and input.os_version <= 7) {
        return print_cbauto_instructions();
    }
    else if (input.os_version == "ubuntu" and input.os_version <= 15.10 {
        return print_cbauto_instructions();
    }
    else (input.os_version == 8) {
        iprint(strings.jessie_backports_instructions);
        backport = " -t jessie-backports "
    }
    return iprint("apt-get install " + backport + debian_packages())
}

debian_packages = function() {
    return strings["debian"][input.webserver];
}

print_cbauto_instructions = function() {
    iprint(strings.cbauto_install);
    command = strings.cbauto_cmd;
}

print_getting_started_instructions = function() {
    if (input.usecase == "automated")
        print_automated_getting_started()
    else if (input.usecase == "manual")
        print_manual_getting_started()
    else if (input.usecase == "developer")
        print_developer_getting_started()
}


print_automated_getting_started() {
    if (input.webserver == "apache") {
        return iprint(strings.apache_automated);
    } elif (input.webserver == "haproxy" || input.webserver == "plesk") {
        iprint(strings.certonly_automated);
        iprint(strings.thirdparty_plugin_note, {plugin: input.webserver});
    } else {
        return iprint(strings.certonly_automated);
    }
}

print_manual_getting_started() {
    return iprint(strings.manual);
}

print_developer_getting_started() {
    if (input.webserver == "apache")
        return iprint(strings.dev_apache)
    else if (input.webserver == "nginx")
        return iprint(strings.dev)
    else
        return iprint(strings.dev)
}

strings {
    base_command {
        packaged: "certbot",
        auto: "/path/to/certbot-auto"
    },
    
    dev_apache:
        "To run the client with apache you'll run as ususal with the --apache flag. This will use apache to complete the certificate challenge as well as editing your apache config to host that certificate. If you'd like to specify apache as just your authenticator or installer use the --authenticator or --installer flags. To find all of the apache commands run with --apache --help",

    jessie_backports_instructions: 
        'Follow the instructions <a href="http://backports.debian.org/Instructions/">here</a> to enable the Jessie backports repo, if you have not already done so',
    
    dev_install:
        "Running the client in developer mode from your local tree is a little different than running <tt>letsencrypt-auto</tt>. To get set up, do these things once:

<pre>
git clone https://github.com/certbot/certbot
cd cerbot
./certbot-auto-source/cerbot-auto --os-packages-only
./tools/venv.sh
</pre>

Then in each shell where you’re working on the client, do:

<pre>source ./venv/bin/activate</pre>",

    thirdparty_plugin_note: 'There is a <a href="https://letsencrypt.readthedocs.org/en/latest/using.html#plugins">third party plugin</a> that adds support for {{PLUGIN}}; it\'s not officially supported by the CertBot team yet, but may work for you!',
    manual:
        "certonly --non-interactive --webroot -w /var/www/example/ -d example.com,www.example.com -w /var/www/other -d other.example.net"
    packages: {
        debian: {
            apache : "certbot python-certbot-nginx",
            nginx : "certbot python-certbot-apache",
            other : "certbot"
        }
    }
}