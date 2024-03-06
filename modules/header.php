<?php
    function selectedPage(array $urls) : string
    {
        foreach ($urls as $url) {
            if ($_SERVER['PHP_SELF'] === $url) {
                return "selected";
            }
        }

        return ""; 
    }
?>

<header>
    <nav>
        <ul class="div_top_nav">
            <li><a href="/listCampaign.php">
                    <div class="info_ico_container <?= selectedPage(["/listCampaign.php", "/campaign.php"]) ?>">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px"
                            viewBox="0,0,256,256">
                            <g fill="#ffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray=""
                                stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none"
                                text-anchor="none" style="mix-blend-mode: normal">
                                <g transform="scale(10.66667,10.66667)">
                                    <path
                                        d="M3,3v16c0,1.09306 0.90694,2 2,2h16v-2h-16v-16zM19.32031,6.31445l-4.33203,4.29102l-2.99414,-2.86328l-5.69141,5.54102l1.39453,1.43359l4.30859,-4.19531l3.00586,2.87305l5.7168,-5.66016z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                        <p class="top_nav_text">Campagnes</p>
                    </div>
                </a></li>
            <li><a href="/configurations.php">
                <div class="info_ico_container <?= selectedPage(["/configurations.php"]) ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0,0,256,256">
                        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                            <g transform="scale(10.66667,10.66667)">
                                <path d="M12,5c3.9,0 7,3.1 7,7c0,3.9 -3.1,7 -7,7c-3.9,0 -7,-3.1 -7,-7c0,-3.9 3.1,-7 7,-7M12,3c-5,0 -9,4 -9,9c0,5 4,9 9,9c5,0 9,-4 9,-9c0,-5 -4,-9 -9,-9z"></path>
                                <path d="M12,9c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3zM11,1h2v3h-2zM11,20h2v3h-2zM20,11h3v2h-3zM1,11h3v2h-3z"></path>
                            </g>
                        </g>
                    </svg>
                    <p class="top_nav_text">Configurations</p>
                </div>
            </a></li>
            <li><a href="/settings.php">
                    <div class="info_ico_container <?= selectedPage(["/settings.php"]) ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px"
                        viewBox="0,0,256,256">
                        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1"
                            stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"
                            stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none"
                            font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                            <g transform="scale(10.66667,10.66667)">
                                <path
                                    d="M10.49023,2c-0.479,0 -0.88847,0.33859 -0.98047,0.80859l-0.33398,1.71484c-0.82076,0.31036 -1.57968,0.74397 -2.24609,1.29102l-1.64453,-0.56641c-0.453,-0.156 -0.95141,0.03131 -1.19141,0.44531l-1.50781,2.61328c-0.239,0.415 -0.15202,0.94186 0.20898,1.25586l1.31836,1.14648c-0.06856,0.42135 -0.11328,0.8503 -0.11328,1.29102c0,0.44072 0.04472,0.86966 0.11328,1.29102l-1.31836,1.14648c-0.361,0.314 -0.44798,0.84086 -0.20898,1.25586l1.50781,2.61328c0.239,0.415 0.73841,0.60227 1.19141,0.44727l1.64453,-0.56641c0.6662,0.54671 1.42571,0.97884 2.24609,1.28906l0.33398,1.71484c0.092,0.47 0.50147,0.80859 0.98047,0.80859h3.01953c0.479,0 0.88847,-0.33859 0.98047,-0.80859l0.33399,-1.71484c0.82076,-0.31036 1.57968,-0.74397 2.24609,-1.29102l1.64453,0.56641c0.453,0.156 0.95141,-0.03031 1.19141,-0.44531l1.50781,-2.61523c0.239,-0.415 0.15202,-0.93991 -0.20898,-1.25391l-1.31836,-1.14648c0.06856,-0.42135 0.11328,-0.8503 0.11328,-1.29102c0,-0.44072 -0.04472,-0.86966 -0.11328,-1.29102l1.31836,-1.14648c0.361,-0.314 0.44798,-0.84086 0.20898,-1.25586l-1.50781,-2.61328c-0.239,-0.415 -0.73841,-0.60227 -1.19141,-0.44727l-1.64453,0.56641c-0.6662,-0.54671 -1.42571,-0.97884 -2.24609,-1.28906l-0.33399,-1.71484c-0.092,-0.47 -0.50147,-0.80859 -0.98047,-0.80859zM12,8c2.209,0 4,1.791 4,4c0,2.209 -1.791,4 -4,4c-2.209,0 -4,-1.791 -4,-4c0,-2.209 1.791,-4 4,-4z">
                                </path>
                            </g>
                        </g>
                    </svg>    
                    
                        <p class="top_nav_text">Paramètres</p>
                    </div>
                </a></li>
            <li><a href="/help.php">
                <div class="info_ico_container <?= selectedPage(["/help.php"]) ?>">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22px" height="22px" viewBox="40 40 176 176">
                        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                            <g transform="scale(4,4)">
                                <path d="M32,10c12.15,0 22,9.85 22,22c0,12.15 -9.85,22 -22,22c-12.15,0 -22,-9.85 -22,-22c0,-12.15 9.85,-22 22,-22zM31.496,43.007c1.568,0 2.506,-1.227 2.506,-2.398c0,-1.171 -0.972,-2.398 -2.506,-2.398c-1.534,0 -2.507,1.297 -2.507,2.398c0,1.101 0.939,2.398 2.507,2.398zM33.512,34.588c0,-3.316 5.803,-2.978 5.803,-8.284c0,-2.664 -2.444,-5.475 -7.056,-5.475c-3.589,0 -7.111,1.881 -7.111,4.713c0,0.527 0.329,1.635 1.662,1.635c0.725,0 1.201,-0.294 1.609,-0.7c0.912,-0.908 1.478,-2.379 3.704,-2.379c0.89,0 2.942,0.451 2.942,2.588c0,3.232 -5.449,3.105 -5.449,7.71c0,1.441 0.63,2.071 1.934,2.071c2.066,0.001 1.962,-1.691 1.962,-1.879z"></path>
                            </g>
                        </g>
                    </svg>
                    <p class="top_nav_text">Aide</p>
                </div>
            </a></li>
        </ul>
    </nav>
</header>